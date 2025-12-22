/*
  Warnings:

  - You are about to drop the column `event_id` on the `availabilities` table. All the data in the column will be lost.
  - You are about to drop the column `deadline` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_type` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `excluded_days` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `host_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `is_confirmed` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the `event_confirmations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[calendar_id]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[calendar_id,user_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `calendar_id` to the `availabilities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calendar_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_at` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_at` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calendar_id` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "availabilities" DROP CONSTRAINT "availabilities_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_confirmations" DROP CONSTRAINT "event_confirmations_event_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_host_id_fkey";

-- DropForeignKey
ALTER TABLE "participants" DROP CONSTRAINT "participants_event_id_fkey";

-- DropIndex
DROP INDEX "availabilities_event_id_slot_idx";

-- DropIndex
DROP INDEX "participants_event_id_user_id_key";

-- AlterTable
ALTER TABLE "availabilities" DROP COLUMN "event_id",
ADD COLUMN     "calendar_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "deadline",
DROP COLUMN "description",
DROP COLUMN "end_date",
DROP COLUMN "end_time",
DROP COLUMN "event_type",
DROP COLUMN "excluded_days",
DROP COLUMN "host_id",
DROP COLUMN "is_confirmed",
DROP COLUMN "start_date",
DROP COLUMN "start_time",
DROP COLUMN "title",
ADD COLUMN     "calendar_id" TEXT NOT NULL,
ADD COLUMN     "end_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "participant_ids" TEXT[],
ADD COLUMN     "start_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "event_id",
ADD COLUMN     "calendar_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "event_confirmations";

-- CreateTable
CREATE TABLE "calendars" (
    "id" TEXT NOT NULL,
    "host_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "event_type" "EventType" NOT NULL DEFAULT 'monthly',
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "start_time" TIME,
    "end_time" TIME,
    "excluded_days" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "exclude_holidays" BOOLEAN NOT NULL DEFAULT false,
    "excluded_dates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deadline" TIMESTAMP(3),
    "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calendars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "availabilities_calendar_id_slot_idx" ON "availabilities"("calendar_id", "slot");

-- CreateIndex
CREATE UNIQUE INDEX "events_calendar_id_key" ON "events"("calendar_id");

-- CreateIndex
CREATE UNIQUE INDEX "participants_calendar_id_user_id_key" ON "participants"("calendar_id", "user_id");

-- AddForeignKey
ALTER TABLE "calendars" ADD CONSTRAINT "calendars_host_id_fkey" FOREIGN KEY ("host_id") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availabilities" ADD CONSTRAINT "availabilities_calendar_id_fkey" FOREIGN KEY ("calendar_id") REFERENCES "calendars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
