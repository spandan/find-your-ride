"use server";

import { prisma } from "@/lib/prisma";
import type { SchoolOption } from "@/lib/schools";

export async function getSchools(): Promise<SchoolOption[]> {
  return prisma.school.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      state: true,
    },
  });
}

export async function getSchoolById(
  schoolId: string
): Promise<SchoolOption | null> {
  return prisma.school.findFirst({
    where: { id: schoolId, active: true },
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      state: true,
    },
  });
}
