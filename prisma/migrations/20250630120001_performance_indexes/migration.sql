-- Extra performance indexes (case-insensitive auth + map filters)

CREATE INDEX "FamilyListing_contactEmail_lower_idx"
  ON "FamilyListing" (lower("contactEmail"));

CREATE INDEX "FamilyListing_status_contactEmail_lower_idx"
  ON "FamilyListing" ("status", lower("contactEmail"))
  WHERE "status" <> 'DELETED';

CREATE INDEX "FamilyListing_firstName_lower_idx"
  ON "FamilyListing" (lower("firstName"));

CREATE INDEX "FamilyListing_lastName_lower_idx"
  ON "FamilyListing" (lower("lastName"));

CREATE INDEX "FamilyListing_reset_identity_idx"
  ON "FamilyListing" ("status", lower("firstName"), lower("lastName"))
  WHERE "status" <> 'DELETED';

CREATE INDEX "FamilyListing_visible_map_idx"
  ON "FamilyListing" ("status", "schoolGroup")
  WHERE "status" IN ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED');

CREATE INDEX "FamilyListing_visible_sharing_intent_idx"
  ON "FamilyListing" ("status", "sharingIntent")
  WHERE "status" IN ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED');

CREATE INDEX "FamilyListing_visible_contact_method_idx"
  ON "FamilyListing" ("status", "preferredContactMethod")
  WHERE "status" IN ('ACTIVE', 'FOUND_RIDE', 'DEACTIVATED');
