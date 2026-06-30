/**
 * Schools in the database. Only active schools appear in signup and filters.
 *
 * Launch: Imagine International only.
 * To onboard another school later:
 *   1. Add an entry here (and re-seed), or INSERT into "School" with active = true
 *   2. Deploy — signup dropdown and map filters expand automatically
 */
export const SEED_SCHOOLS = [
  {
    id: "school_imagine_international",
    slug: "imagine-international",
    name: "Imagine International Academy of North Texas",
    city: "Frisco",
    state: "TX",
  },
] as const;

export type SchoolOption = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
};

export const DEFAULT_SCHOOL_ID = SEED_SCHOOLS[0].id;

export const DEFAULT_SCHOOL_NAME = SEED_SCHOOLS[0].name;

export function hasMultipleSchools(schools: SchoolOption[]): boolean {
  return schools.length > 1;
}

export function getSchoolNameById(
  schools: SchoolOption[],
  schoolId: string
): string | undefined {
  return schools.find((s) => s.id === schoolId)?.name;
}
