# School Pickup Share Map

A privacy-conscious dashboard where parents can add themselves to a shared map and find nearby pickup/drop-off partners based on school group, timing, and location.

## Tech Stack

- **Next.js** (App Router) + React + TypeScript
- **Tailwind CSS**
- **MapLibre GL** + **OpenFreeMap** tiles (OpenStreetMap data)
- **PostgreSQL** + **Prisma**

## Features

- Interactive map with color-coded family markers (green = K–5, red = 6–12, blue = K–12 mixed)
- Address/intersection search with geocoding (Nominatim by default; optional LocationIQ)
- Filters by school group, pickup/drop-off time compatibility, distance, and contact method
- Add-family form with automatic school group derivation from grades
- Privacy-conscious location display (intersection/neighborhood preferred, coordinate blurring)
- Contact info shown only when opted in
- **Found My Ride** status — mark listings inactive without deleting
- Passcode-based listing management (edit, found ride, reactivate, delete)
- Seed data for demo/testing

## Listing Status

| Status | Map | Search results | Contact |
|--------|-----|----------------|---------|
| **ACTIVE** | Normal marker | Included by default | Shown if opted in |
| **FOUND_RIDE** | Muted marker (~45% opacity) + "✓ Found Ride" badge | Excluded unless filter enabled | Hidden unless owner opts in |
| **DELETED** | Hidden | Hidden | Hidden (soft-deleted for audit) |

Parents manage listings with a **listing ID + passcode** set at creation time. Actions: edit, mark as Found My Ride, reactivate, or delete.

## School Groups & Hours

| Group | Grades | Schedule |
|-------|--------|----------|
| **Lower School** | K–5 | M/T/Th/F 7:30 AM – 3:15 PM · Wed 7:30 AM – 11:45 AM |
| **Upper School** | 6–12 | M/T/Th/F 8:00 AM – 3:45 PM · Wed 8:00 AM – 12:15 PM |
| **Mixed** | Both | Lower students with Upper siblings follow Upper School pickup schedule |

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and set your database URL:

```bash
cp .env.example .env
```

Edit `.env` and set `DATABASE_URL` to your PostgreSQL connection string.

**Option A — Local PostgreSQL**

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/school_pickup_map"
```

**Option B — Prisma Postgres dev server**

```bash
npx prisma dev
```

This starts a local Postgres instance and writes a `prisma+postgres://` URL to `.env`. The app automatically resolves this to the underlying Postgres connection for the Prisma 7 driver adapter.

### 3. Run Prisma migrations

```bash
npm run db:migrate
```

Or push schema without migration history:

```bash
npm run db:push
```

### 4. Seed demo data

```bash
npm run db:seed
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `SESSION_SECRET` | Secret for session cookies (required in production) |
| `GEOCODING_PROVIDER` | `nominatim` (default) or `locationiq` |
| `GEOCODING_USER_AGENT` | Custom User-Agent for Nominatim (optional) |
| `LOCATIONIQ_API_KEY` | API key when using LocationIQ geocoding |

## Open-source compliance

This app uses **MapLibre GL**, **OpenFreeMap** tiles, and **OpenStreetMap** data.
Geocoding uses **Nominatim** by default (strict rate limits) or optional **LocationIQ**.

- Map attribution is shown on the map (© OpenStreetMap, OpenFreeMap, MapLibre).
- Nominatim usage is throttled to **≤1 request/second** in server code.
- Full license and policy details: [`THIRD_PARTY_NOTICES.md`](./THIRD_PARTY_NOTICES.md).

### Geocoding providers and rate limits

| Provider | Cost | Typical limits | Notes |
|----------|------|----------------|-------|
| **Nominatim** (default) | Free | ~1 req/sec | Public OSM service; fine for low-traffic community use |
| **LocationIQ** | Free tier + paid | ~5,000/day free | OSM-based; set `GEOCODING_PROVIDER=locationiq` and `LOCATIONIQ_API_KEY` |
| **OpenFreeMap tiles** | Free | Very generous | Not a bottleneck for this app |

**Map tiles** (OpenFreeMap) are already very permissive — the practical limit is **address search**, not map display. For growth beyond a small parent community, switch to LocationIQ on Railway:

```env
GEOCODING_PROVIDER=locationiq
LOCATIONIQ_API_KEY=your_key
```

Other OSM-based options (Geoapify, Photon/Komoot, self-hosted Nominatim) can be added similarly if needed.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed demo family listings |

## Privacy & Safety

This tool involves children and families. The MVP includes:

- **No child names** collected or displayed
- **Intersection/neighborhood** locations preferred over exact home addresses
- **Coordinate blurring** when approximate or intersection mode is selected
- **Opt-in contact sharing** — email/phone hidden unless the parent enables it
- **Safety disclaimer** on the add-family form
- **Soft delete** — deleted listings preserved for audit, never shown publicly
- **Passcode protection** for listing management (TODO: replace with full auth)

**Parents must verify identity independently and coordinate safely.** This is a community coordination tool, not a vetted carpool matching service.

## Demo seed credentials

After running `npm run db:seed`, all demo listings use passcode: `demo1234`. Two listings are pre-marked as Found My Ride (Sarah M., Lisa W.).

## Project Structure

```
src/
  actions/listings.ts    # Server actions (create, search, manage, geocode)
  lib/analytics.ts       # Stored match metrics (not displayed in MVP)
  lib/passcode.ts        # Passcode hashing and verification
  components/            # Dashboard, map, form, filters
  lib/                   # Helpers (geocode, school group, distance, blur)
  generated/prisma/      # Prisma client (generated)
prisma/
  schema.prisma          # FamilyListing model
  seed.ts                # Demo data
```

## TODO (Future Work)

- [ ] **Authentication** — replace passcode with school email or OAuth
- [ ] **Parent verification** — verify identity before listing goes live
- [ ] **School-specific access** — restrict map to verified school community
- [ ] **Moderation** — review queue for new listings and reporting
- [ ] **Admin dashboard** — display stored analytics (match rate, active vs found ride)
- [ ] **Rate limiting** on listing creation (geocoding throttled; see `src/lib/geocode.ts`)

## License

Private / community use.
