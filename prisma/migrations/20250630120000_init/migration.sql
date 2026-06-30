-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "SchoolGroup" AS ENUM ('LOWER', 'UPPER', 'MIXED');

-- CreateEnum
CREATE TYPE "LocationPrecision" AS ENUM ('EXACT', 'APPROXIMATE', 'INTERSECTION');

-- CreateEnum
CREATE TYPE "PreferredContactMethod" AS ENUM ('EMAIL', 'PHONE', 'TEXT', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED', 'DELETED');

-- CreateEnum
CREATE TYPE "SharingIntent" AS ENUM ('PICKUP', 'DROPOFF', 'BOTH');

-- CreateTable
CREATE TABLE "FamilyListing" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "username" TEXT NOT NULL DEFAULT '',
    "parentDisplayName" TEXT NOT NULL,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "preferredContactMethod" "PreferredContactMethod" NOT NULL,
    "streetName" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "state" TEXT NOT NULL DEFAULT 'TX',
    "locationText" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "displayLatitude" DOUBLE PRECISION NOT NULL,
    "displayLongitude" DOUBLE PRECISION NOT NULL,
    "locationPrecision" "LocationPrecision" NOT NULL DEFAULT 'APPROXIMATE',
    "showExactLocation" BOOLEAN NOT NULL DEFAULT false,
    "showPersonalInfo" BOOLEAN NOT NULL DEFAULT true,
    "showContactInfo" BOOLEAN NOT NULL DEFAULT true,
    "showContactWhenFoundRide" BOOLEAN NOT NULL DEFAULT false,
    "numberOfKids" INTEGER NOT NULL,
    "grades" TEXT[],
    "schoolName" TEXT NOT NULL DEFAULT 'Imagine International Academy of North Texas',
    "schoolGroup" "SchoolGroup" NOT NULL,
    "dropoffTimePreference" TEXT NOT NULL DEFAULT 'Flexible',
    "pickupTimePreference" TEXT NOT NULL DEFAULT 'Flexible',
    "sharingIntent" "SharingIntent" NOT NULL DEFAULT 'BOTH',
    "notes" TEXT,
    "consentGiven" BOOLEAN NOT NULL DEFAULT false,
    "status" "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
    "passcodeHash" TEXT NOT NULL DEFAULT '',
    "foundRideAt" TIMESTAMP(3),
    "deactivatedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FamilyListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppAnalytics" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "totalListingsCreated" INTEGER NOT NULL DEFAULT 0,
    "activeListings" INTEGER NOT NULL DEFAULT 0,
    "foundRideListings" INTEGER NOT NULL DEFAULT 0,
    "deletedListings" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FamilyListing_schoolGroup_idx" ON "FamilyListing"("schoolGroup");

-- CreateIndex
CREATE INDEX "FamilyListing_status_idx" ON "FamilyListing"("status");

-- CreateIndex
CREATE INDEX "FamilyListing_latitude_longitude_idx" ON "FamilyListing"("latitude", "longitude");

-- CreateIndex
CREATE INDEX "FamilyListing_contactEmail_idx" ON "FamilyListing"("contactEmail");

-- CreateIndex
CREATE INDEX "FamilyListing_status_username_idx" ON "FamilyListing"("status", "username");

-- CreateIndex
CREATE INDEX "FamilyListing_displayLatitude_displayLongitude_idx" ON "FamilyListing"("displayLatitude", "displayLongitude");

-- CreateIndex
CREATE INDEX "FamilyListing_sharingIntent_idx" ON "FamilyListing"("sharingIntent");

-- CreateIndex
CREATE INDEX "FamilyListing_preferredContactMethod_idx" ON "FamilyListing"("preferredContactMethod");

-- CreateIndex
CREATE INDEX "FamilyListing_createdAt_idx" ON "FamilyListing"("createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "FamilyListing_username_key" ON "FamilyListing"("username");
