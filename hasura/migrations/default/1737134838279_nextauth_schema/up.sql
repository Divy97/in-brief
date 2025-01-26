-- Add NextAuth.js fields to users table
ALTER TABLE "public"."users"
  ADD COLUMN IF NOT EXISTS "email_verified" TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS "image" TEXT;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS "public"."accounts";
DROP TABLE IF EXISTS "public"."sessions";
DROP TABLE IF EXISTS "public"."verification_tokens";

-- Create accounts table
CREATE TABLE "public"."accounts" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshToken" TEXT,
    "accessToken" TEXT,
    "expiresAt" BIGINT,
    "tokenType" TEXT,
    "scope" TEXT,
    "idToken" TEXT,
    "sessionState" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE("provider", "providerAccountId")
);

-- Create sessions table
CREATE TABLE "public"."sessions" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "sessionToken" TEXT NOT NULL UNIQUE,
    "userId" UUID NOT NULL REFERENCES "public"."users"("id") ON DELETE CASCADE,
    "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create verification tokens table
CREATE TABLE "public"."verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP WITH TIME ZONE NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY ("identifier", "token")
);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER "set_public_accounts_updated_at"
    BEFORE UPDATE ON "public"."accounts"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

CREATE TRIGGER "set_public_sessions_updated_at"
    BEFORE UPDATE ON "public"."sessions"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();

CREATE TRIGGER "set_public_verification_tokens_updated_at"
    BEFORE UPDATE ON "public"."verification_tokens"
    FOR EACH ROW
    EXECUTE FUNCTION "public"."set_current_timestamp_updated_at"();
