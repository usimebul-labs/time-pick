-- CreateTable
CREATE TABLE "event_confirmations" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "message" TEXT,
    "participant_ids" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_confirmations_event_id_key" ON "event_confirmations"("event_id");

-- AddForeignKey
ALTER TABLE "event_confirmations" ADD CONSTRAINT "event_confirmations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
