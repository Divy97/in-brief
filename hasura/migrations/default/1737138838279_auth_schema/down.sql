-- Drop triggers
DROP TRIGGER IF EXISTS "set_public_verification_tokens_updated_at" ON "public"."verification_tokens";
DROP TRIGGER IF EXISTS "set_public_users_updated_at" ON "public"."users";

-- Drop trigger function
DROP FUNCTION IF EXISTS "public"."set_current_timestamp_updated_at"();

-- Drop tables in correct order due to foreign key constraints
DROP TABLE IF EXISTS "public"."verification_tokens";
DROP TABLE IF EXISTS "public"."sessions";
DROP TABLE IF EXISTS "public"."accounts";
DROP TABLE IF EXISTS "public"."users"; 