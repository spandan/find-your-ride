-- Run as a PostgreSQL superuser (e.g. postgres), not inside the app database.
-- Example:
--   psql -U postgres -f prisma/sql/00_create_database.sql

SELECT 'CREATE DATABASE school_pickup_map'
WHERE NOT EXISTS (
  SELECT FROM pg_database WHERE datname = 'school_pickup_map'
)\gexec
