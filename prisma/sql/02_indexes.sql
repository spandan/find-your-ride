-- School Pickup Share Map — indexes
-- Run after 01_schema.sql:
--   psql "$DATABASE_URL" -f prisma/sql/02_indexes.sql

BEGIN;

-- ---------------------------------------------------------------------------
-- Prisma schema indexes
-- ---------------------------------------------------------------------------

CREATE UNIQUE INDEX IF NOT EXISTS "FamilyListing_username_key"
  ON "FamilyListing" ("username");

CREATE INDEX IF NOT EXISTS "FamilyListing_schoolGroup_idx"
  ON "FamilyListing" ("schoolGroup");

CREATE INDEX IF NOT EXISTS "FamilyListing_status_idx"
  ON "FamilyListing" ("status");

CREATE INDEX IF NOT EXISTS "FamilyListing_latitude_longitude_idx"
  ON "FamilyListing" ("latitude", "longitude");

-- ---------------------------------------------------------------------------
-- Auth: login by username or email (case-insensitive email)
-- Used by findByLoginId() and findListingForPasscodeReset()
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "FamilyListing_contactEmail_lower_idx"
  ON "FamilyListing" (lower("contactEmail"));

CREATE INDEX IF NOT EXISTS "FamilyListing_status_username_idx"
  ON "FamilyListing" ("status", "username")
  WHERE "status" <> 'DELETED';

CREATE INDEX IF NOT EXISTS "FamilyListing_status_contactEmail_lower_idx"
  ON "FamilyListing" ("status", lower("contactEmail"))
  WHERE "status" <> 'DELETED';

-- ---------------------------------------------------------------------------
-- Auth: passcode reset identity lookup (first + last name, case-insensitive)
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "FamilyListing_firstName_lower_idx"
  ON "FamilyListing" (lower("firstName"));

CREATE INDEX IF NOT EXISTS "FamilyListing_lastName_lower_idx"
  ON "FamilyListing" (lower("lastName"));

CREATE INDEX IF NOT EXISTS "FamilyListing_reset_identity_idx"
  ON "FamilyListing" ("status", lower("firstName"), lower("lastName"))
  WHERE "status" <> 'DELETED';

-- ---------------------------------------------------------------------------
-- Map & filters: load visible listings and filter by school group / intent
-- getMapListings(), client filters, community stats
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "FamilyListing_visible_map_idx"
  ON "FamilyListing" ("status", "schoolGroup")
  WHERE "status" IN ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED');

CREATE INDEX IF NOT EXISTS "FamilyListing_visible_sharing_intent_idx"
  ON "FamilyListing" ("status", "sharingIntent")
  WHERE "status" IN ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED');

CREATE INDEX IF NOT EXISTS "FamilyListing_visible_contact_method_idx"
  ON "FamilyListing" ("status", "preferredContactMethod")
  WHERE "status" IN ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED');

CREATE INDEX IF NOT EXISTS "FamilyListing_display_lat_lng_idx"
  ON "FamilyListing" ("displayLatitude", "displayLongitude");

-- ---------------------------------------------------------------------------
-- Admin / reporting
-- ---------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS "FamilyListing_createdAt_idx"
  ON "FamilyListing" ("createdAt" DESC);

COMMIT;
