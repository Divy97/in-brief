-- Rename columns to match NextAuth requirements
ALTER TABLE "accounts" RENAME COLUMN "provider_account_id" TO "providerAccountId";
ALTER TABLE "accounts" RENAME COLUMN "user_id" TO "userId";

ALTER TABLE "sessions" RENAME COLUMN "user_id" TO "userId";
ALTER TABLE "sessions" RENAME COLUMN "session_token" TO "sessionToken";

ALTER TABLE "verification_tokens" RENAME COLUMN "identifier" TO "identifier";
ALTER TABLE "verification_tokens" RENAME COLUMN "token" TO "token";
ALTER TABLE "verification_tokens" RENAME COLUMN "expires" TO "expires";
