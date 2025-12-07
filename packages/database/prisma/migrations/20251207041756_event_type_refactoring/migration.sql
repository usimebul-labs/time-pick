/*
  Warnings:

  - The values [date_only,date_time] on the enum `EventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventType_new" AS ENUM ('monthly', 'weekly');
ALTER TABLE "public"."events" ALTER COLUMN "event_type" DROP DEFAULT;
ALTER TABLE "events" ALTER COLUMN "event_type" TYPE "EventType_new" USING ("event_type"::text::"EventType_new");
ALTER TYPE "EventType" RENAME TO "EventType_old";
ALTER TYPE "EventType_new" RENAME TO "EventType";
DROP TYPE "public"."EventType_old";
ALTER TABLE "events" ALTER COLUMN "event_type" SET DEFAULT 'monthly';
COMMIT;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "deadline" TIMESTAMP(3),
ALTER COLUMN "event_type" SET DEFAULT 'monthly';
