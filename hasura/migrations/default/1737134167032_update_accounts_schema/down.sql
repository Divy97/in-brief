-- Drop triggers
DROP TRIGGER IF EXISTS set_timestamp ON verification_tokens;
DROP TRIGGER IF EXISTS set_timestamp ON sessions;
DROP TRIGGER IF EXISTS set_timestamp ON accounts;
DROP TRIGGER IF EXISTS set_timestamp ON users;

-- Drop function
DROP FUNCTION IF EXISTS trigger_set_timestamp;

-- Drop tables in correct order (due to foreign key constraints)
DROP TABLE IF EXISTS "public"."verification_tokens";
DROP TABLE IF EXISTS "public"."sessions";
DROP TABLE IF EXISTS "public"."accounts";

-- Don't drop users table as it might have other dependencies
-- Instead, revert its schema changes
ALTER TABLE "public"."users" 
  DROP COLUMN IF EXISTS "emailVerified",
  DROP COLUMN IF EXISTS "image",
  DROP COLUMN IF EXISTS "created_at",
  DROP COLUMN IF EXISTS "updated_at";
