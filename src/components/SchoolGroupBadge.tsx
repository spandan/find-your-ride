import type { SchoolGroup } from "@/generated/prisma/client";
import {
  getSchoolGroupBadgeClass,
  getSchoolGroupLabel,
} from "@/lib/school";

export function SchoolGroupBadge({ group }: { group: SchoolGroup }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getSchoolGroupBadgeClass(group)}`}
    >
      {getSchoolGroupLabel(group)}
    </span>
  );
}
