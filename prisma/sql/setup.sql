-- Full manual database setup for School Pickup Share Map
--
-- 1) Create database (superuser only):
--      psql -U postgres -f prisma/sql/00_create_database.sql
--
-- 2) Apply schema + indexes:
--      psql "postgresql://postgres:postgres@localhost:5432/school_pickup_map" -f prisma/sql/setup.sql
--
-- Or with DATABASE_URL from .env:
--      psql "$DATABASE_URL" -f prisma/sql/setup.sql
--
-- After SQL setup, seed demo data (optional):
--      npm run db:seed
--
-- Prisma alternative (keeps schema in sync with prisma/schema.prisma):
--      npx prisma db push

\ir 01_schema.sql
\ir 02_indexes.sql
