ALTER TABLE "public"."summaries"
ADD COLUMN "overview" text,
ADD COLUMN "main_points" jsonb,
ADD COLUMN "key_quotes" jsonb,
ADD COLUMN "detailed_summary" text; 