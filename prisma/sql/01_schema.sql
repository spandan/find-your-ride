-- School Pickup Share Map — core schema
-- Run against the target database:
--   psql "$DATABASE_URL" -f prisma/sql/01_schema.sql

BEGIN;

-- ---------------------------------------------------------------------------
-- Enum types
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE "SchoolGroup" AS ENUM ('LOWER', 'UPPER', 'MIXED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "LocationPrecision" AS ENUM ('EXACT', 'APPROXIMATE', 'INTERSECTION');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "PreferredContactMethod" AS ENUM ('EMAIL', 'PHONE', 'TEXT', 'WHATSAPP');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED', 'DELETED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "SharingIntent" AS ENUM ('PICKUP', 'DROPOFF', 'BOTH');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "FamilyListing" (
  "id"                       TEXT NOT NULL,
  "firstName"                TEXT NOT NULL DEFAULT '',
  "lastName"                 TEXT NOT NULL DEFAULT '',
  "username"                 TEXT NOT NULL DEFAULT '',
  "parentDisplayName"        TEXT NOT NULL,
  "contactEmail"             TEXT NOT NULL,
  "contactPhone"             TEXT,
  "preferredContactMethod"   "PreferredContactMethod" NOT NULL,
  "streetName"               TEXT NOT NULL DEFAULT '',
  "city"                     TEXT NOT NULL DEFAULT '',
  "state"                    TEXT NOT NULL DEFAULT 'TX',
  "locationText"             TEXT NOT NULL,
  "latitude"                 DOUBLE PRECISION NOT NULL,
  "longitude"                DOUBLE PRECISION NOT NULL,
  "displayLatitude"          DOUBLE PRECISION NOT NULL,
  "displayLongitude"         DOUBLE PRECISION NOT NULL,
  "locationPrecision"        "LocationPrecision" NOT NULL DEFAULT 'APPROXIMATE',
  "showExactLocation"        BOOLEAN NOT NULL DEFAULT FALSE,
  "showPersonalInfo"         BOOLEAN NOT NULL DEFAULT TRUE,
  "showContactInfo"          BOOLEAN NOT NULL DEFAULT TRUE,
  "showContactWhenFoundRide" BOOLEAN NOT NULL DEFAULT FALSE,
  "numberOfKids"             INTEGER NOT NULL,
  "grades"                   TEXT[] NOT NULL,
  "schoolName"               TEXT NOT NULL DEFAULT 'Imagine International Academy of North Texas',
  "schoolGroup"              "SchoolGroup" NOT NULL,
  "dropoffTimePreference"    TEXT NOT NULL DEFAULT 'Flexible',
  "pickupTimePreference"     TEXT NOT NULL DEFAULT 'Flexible',
  "sharingIntent"            "SharingIntent" NOT NULL DEFAULT 'BOTH',
  "notes"                    TEXT,
  "consentGiven"             BOOLEAN NOT NULL DEFAULT FALSE,
  "status"                   "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
  "passcodeHash"             TEXT NOT NULL DEFAULT '',
  "foundRideAt"              TIMESTAMP(3),
  "deactivatedAt"            TIMESTAMP(3),
  "deletedAt"                TIMESTAMP(3),
  "createdAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"                TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "FamilyListing_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AppAnalytics" (
  "id"                   TEXT NOT NULL,
  "totalListingsCreated" INTEGER NOT NULL DEFAULT 0,
  "activeListings"       INTEGER NOT NULL DEFAULT 0,
  "foundRideListings"    INTEGER NOT NULL DEFAULT 0,
  "deletedListings"      INTEGER NOT NULL DEFAULT 0,
  "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AppAnalytics_pkey" PRIMARY KEY ("id")
);

-- Keep updatedAt in sync when rows are updated outside Prisma.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS family_listing_set_updated_at ON "FamilyListing";
CREATE TRIGGER family_listing_set_updated_at
  BEFORE UPDATE ON "FamilyListing"
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

DROP TRIGGER IF EXISTS app_analytics_set_updated_at ON "AppAnalytics";
CREATE TRIGGER app_analytics_set_updated_at
  BEFORE UPDATE ON "AppAnalytics"
  FOR EACH ROW
  EXECUTE PROCEDURE set_updated_at();

COMMIT;
