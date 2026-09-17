-- PostgreSQL initialization for AHADI development
-- This runs once when the container is first created.

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- for LIKE/fuzzy search optimization
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- for composite GIN indexes

-- Create test database for integration tests
CREATE DATABASE ahadi_test;
GRANT ALL PRIVILEGES ON DATABASE ahadi_test TO ahadi;
