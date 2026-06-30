import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { resolveDatabaseUrl, withDatabaseSsl } from "../src/lib/database-url";
import { blurCoordinates } from "../src/lib/location";
import { SEED_SCHOOLS } from "../src/lib/schools";
import { hashPasscode } from "../src/lib/passcode";
import { deriveSchoolGroup } from "../src/lib/school";

const adapter = new PrismaPg({
  connectionString: withDatabaseSsl(resolveDatabaseUrl()),
});
const prisma = new PrismaClient({ adapter });

type SeedFamily = {
  parentDisplayName: string;
  contactEmail: string;
  contactPhone: string | null;
  preferredContactMethod: "EMAIL" | "PHONE" | "TEXT" | "WHATSAPP";
  streetName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  numberOfKids: number;
  grades: string[];
  sharingIntent?: "PICKUP" | "DROPOFF" | "BOTH";
  status?: "ACTIVE" | "FOUND_RIDE";
  schoolSlug?: string;
};

const families: SeedFamily[] = [
  {
    parentDisplayName: "Sarah M.",
    contactEmail: "sarah.m@example.com",
    contactPhone: "(469) 555-0101",
    preferredContactMethod: "TEXT",
    streetName: "Main St",
    city: "Frisco",
    state: "TX",
    latitude: 33.1507,
    longitude: -96.8236,
    numberOfKids: 2,
    grades: ["2", "4"],
    status: "FOUND_RIDE",
  },
  {
    parentDisplayName: "James K.",
    contactEmail: "james.k@example.com",
    contactPhone: null,
    preferredContactMethod: "EMAIL",
    streetName: "Preston Rd",
    city: "Frisco",
    state: "TX",
    latitude: 33.107,
    longitude: -96.808,
    numberOfKids: 1,
    grades: ["K"],
  },
  {
    parentDisplayName: "Priya R.",
    contactEmail: "priya.r@example.com",
    contactPhone: "(469) 555-0202",
    preferredContactMethod: "WHATSAPP",
    streetName: "Lebanon Rd",
    city: "Frisco",
    state: "TX",
    latitude: 33.089,
    longitude: -96.795,
    numberOfKids: 3,
    grades: ["1", "3", "5"],
  },
  {
    parentDisplayName: "Michael T.",
    contactEmail: "michael.t@example.com",
    contactPhone: "(469) 555-0303",
    preferredContactMethod: "PHONE",
    streetName: "Dallas Pkwy",
    city: "Frisco",
    state: "TX",
    latitude: 33.162,
    longitude: -96.835,
    numberOfKids: 1,
    grades: ["9"],
    sharingIntent: "DROPOFF",
  },
  {
    parentDisplayName: "Lisa W.",
    contactEmail: "lisa.w@example.com",
    contactPhone: null,
    preferredContactMethod: "EMAIL",
    streetName: "Legacy Dr",
    city: "Frisco",
    state: "TX",
    latitude: 33.178,
    longitude: -96.856,
    numberOfKids: 2,
    grades: ["7", "10"],
    status: "FOUND_RIDE",
  },
  {
    parentDisplayName: "David & Ana P.",
    contactEmail: "david.ana@example.com",
    contactPhone: "(469) 555-0404",
    preferredContactMethod: "TEXT",
    streetName: "Teel Pkwy",
    city: "Frisco",
    state: "TX",
    latitude: 33.155,
    longitude: -96.838,
    numberOfKids: 3,
    grades: ["3", "8", "11"],
    sharingIntent: "BOTH",
  },
  {
    parentDisplayName: "Karen H.",
    contactEmail: "karen.h@example.com",
    contactPhone: "(469) 555-0505",
    preferredContactMethod: "EMAIL",
    streetName: "Rolater Rd",
    city: "Frisco",
    state: "TX",
    latitude: 33.142,
    longitude: -96.769,
    numberOfKids: 2,
    grades: ["4", "6"],
    sharingIntent: "DROPOFF",
  },
  {
    parentDisplayName: "Robert C.",
    contactEmail: "robert.c@example.com",
    contactPhone: null,
    preferredContactMethod: "TEXT",
    streetName: "Warren Pkwy",
    city: "Frisco",
    state: "TX",
    latitude: 33.198,
    longitude: -96.851,
    numberOfKids: 1,
    grades: ["12"],
  },
  {
    parentDisplayName: "Emily N.",
    contactEmail: "emily.n@example.com",
    contactPhone: "(469) 555-0606",
    preferredContactMethod: "WHATSAPP",
    streetName: "Stonebrook Pkwy",
    city: "Frisco",
    state: "TX",
    latitude: 33.168,
    longitude: -96.862,
    numberOfKids: 2,
    grades: ["5", "7"],
    sharingIntent: "PICKUP",
  },
  {
    parentDisplayName: "Tom B.",
    contactEmail: "tom.b@example.com",
    contactPhone: "(469) 555-0707",
    preferredContactMethod: "PHONE",
    streetName: "Gaylord Pkwy",
    city: "Frisco",
    state: "TX",
    latitude: 33.107,
    longitude: -96.795,
    numberOfKids: 1,
    grades: ["6"],
    sharingIntent: "PICKUP",
  },
];

async function main() {
  const demoPasscodeHash = await hashPasscode("demo1234");

  console.log("Clearing existing data...");
  await prisma.familyListing.deleteMany();
  await prisma.appAnalytics.deleteMany();
  await prisma.school.deleteMany();

  console.log("Seeding schools...");
  for (const school of SEED_SCHOOLS) {
    await prisma.school.create({
      data: {
        id: school.id,
        slug: school.slug,
        name: school.name,
        city: school.city,
        state: school.state,
      },
    });
  }

  const schoolBySlug = Object.fromEntries(
    SEED_SCHOOLS.map((s) => [s.slug, s])
  );

  console.log("Seeding Frisco, TX family listings...");
  let activeCount = 0;
  let foundRideCount = 0;

  for (const family of families) {
    const schoolGroup = deriveSchoolGroup(family.grades);
    const status = family.status ?? "ACTIVE";
    if (status === "ACTIVE") activeCount++;
    if (status === "FOUND_RIDE") foundRideCount++;

    const locationText = `${family.streetName}, ${family.city}, ${family.state}`;
    const identity = {
      firstName: family.parentDisplayName.split(" ")[0],
      lastName:
        family.parentDisplayName.split(" ").slice(1).join(" ") || "Family",
      username: family.contactEmail.split("@")[0].toLowerCase(),
    };

    const tempId = `seed-${family.parentDisplayName}`;
    const display = blurCoordinates(
      family.latitude,
      family.longitude,
      tempId
    );

    const school =
      schoolBySlug[family.schoolSlug ?? "imagine-international"] ??
      SEED_SCHOOLS[0];

    const listing = await prisma.familyListing.create({
      data: {
        firstName: identity.firstName,
        lastName: identity.lastName,
        username: identity.username,
        parentDisplayName: family.parentDisplayName,
        contactEmail: family.contactEmail,
        contactPhone: family.contactPhone,
        preferredContactMethod: family.preferredContactMethod,
        streetName: family.streetName,
        city: family.city,
        state: family.state,
        locationText,
        latitude: family.latitude,
        longitude: family.longitude,
        displayLatitude: display.latitude,
        displayLongitude: display.longitude,
        locationPrecision: "APPROXIMATE",
        showExactLocation: false,
        showContactInfo: true,
        numberOfKids: family.numberOfKids,
        grades: family.grades,
        schoolId: school.id,
        schoolName: school.name,
        schoolGroup,
        sharingIntent: family.sharingIntent ?? "BOTH",
        showPersonalInfo: true,
        pickupTimePreference: status === "ACTIVE" ? "3:35 PM" : "Flexible",
        dropoffTimePreference: status === "ACTIVE" ? "7:30 AM" : "Flexible",
        consentGiven: true,
        status,
        passcodeHash: demoPasscodeHash,
        foundRideAt: status === "FOUND_RIDE" ? new Date() : null,
      },
    });

    const stable = blurCoordinates(
      family.latitude,
      family.longitude,
      listing.id
    );
    await prisma.familyListing.update({
      where: { id: listing.id },
      data: {
        displayLatitude: stable.latitude,
        displayLongitude: stable.longitude,
      },
    });
  }

  await prisma.appAnalytics.create({
    data: {
      id: "singleton",
      totalListingsCreated: families.length,
      activeListings: activeCount,
      foundRideListings: foundRideCount,
      deletedListings: 0,
    },
  });

  console.log(
    `Seeded ${families.length} families in Frisco, TX (${activeCount} active, ${foundRideCount} found ride).`
  );
  console.log("Demo passcode: demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
