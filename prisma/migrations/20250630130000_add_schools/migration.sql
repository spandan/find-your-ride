-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Frisco',
    "state" TEXT NOT NULL DEFAULT 'TX',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "School_name_key" ON "School"("name");
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");
CREATE INDEX "School_active_idx" ON "School"("active");

INSERT INTO "School" ("id", "name", "slug", "city", "state", "active", "createdAt")
VALUES
  (
    'school_imagine_international',
    'Imagine International Academy of North Texas',
    'imagine-international',
    'Frisco',
    'TX',
    true,
    CURRENT_TIMESTAMP
  );

ALTER TABLE "FamilyListing" ADD COLUMN "schoolId" TEXT;

UPDATE "FamilyListing"
SET "schoolId" = 'school_imagine_international'
WHERE "schoolId" IS NULL;

ALTER TABLE "FamilyListing" ALTER COLUMN "schoolId" SET NOT NULL;

CREATE INDEX "FamilyListing_schoolId_idx" ON "FamilyListing"("schoolId");

ALTER TABLE "FamilyListing"
ADD CONSTRAINT "FamilyListing_schoolId_fkey"
FOREIGN KEY ("schoolId") REFERENCES "School"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
