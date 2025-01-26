-- Drop triggers
DROP TRIGGER IF EXISTS "set_public_verification_tokens_updated_at" ON "public"."verification_tokens";
DROP TRIGGER IF EXISTS "set_public_sessions_updated_at" ON "public"."sessions";
DROP TRIGGER IF EXISTS "set_public_accounts_updated_at" ON "public"."accounts";

-- Drop function
DROP FUNCTION IF EXISTS "public"."set_current_timestamp_updated_at";

-- Drop tables
DROP TABLE IF EXISTS "public"."verification_tokens";
DROP TABLE IF EXISTS "public"."sessions";
DROP TABLE IF EXISTS "public"."accounts";

-- Remove columns from users table
ALTER TABLE "public"."users"
  DROP COLUMN IF EXISTS "email_verified",
  DROP COLUMN IF EXISTS "image";
