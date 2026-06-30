-- AlterTable
ALTER TABLE "FamilyListing" ADD COLUMN "agreementAccepted" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "FamilyListing" ADD COLUMN "agreementVersion" TEXT;
ALTER TABLE "FamilyListing" ADD COLUMN "agreementAcceptedAt" TIMESTAMP(3);
ALTER TABLE "FamilyListing" ADD COLUMN "agreementIpAddress" TEXT;
