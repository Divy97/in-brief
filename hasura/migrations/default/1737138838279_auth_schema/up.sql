-- Drop existing triggers and functions first
DROP TRIGGER IF EXISTS "set_public_verification_tokens_updated_at" ON "public"."verification_tokens";
DROP TRIGGER IF EXISTS "set_public_users_updated_at" ON "public"."users";
DROP FUNCTION IF EXISTS "public"."set_current_timestamp_updated_at"();

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT,
    "image" TEXT,
    "emailVerified" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create accounts table for OAuth providers
CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "user_id" UUID NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" BIGINT,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,
    UNIQUE("provider", "provider_account_id")
);

-- Create sessions table
CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    "session_token" TEXT NOT NULL UNIQUE,
    "user_id" UUID NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "expires" TIMESTAMPTZ NOT NULL
);

-- Create verification tokens table for email verification
CREATE TABLE IF NOT EXISTS "public"."verification_tokens" (
    "token" TEXT NOT NULL PRIMARY KEY,
    "identifier" TEXT NOT NULL,
    "expires" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER "set_public_users_updated_at"
    BEFORE UPDATE ON "public"."users"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

CREATE TRIGGER "set_public_verification_tokens_updated_at"
    BEFORE UPDATE ON "public"."verification_tokens"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"(); 