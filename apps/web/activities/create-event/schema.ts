import { z } from "zod";

// Matching Prisma Enum: EventType { monthly, weekly }
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["monthly", "weekly"]),
  dates: z.array(z.date()).min(1, "Select at least one date"),
  // Excluded days might be strictly handled by UI, 
  // but good to validate if passed as array of strings/dates
  excludedDays: z.array(z.string()).optional(),
});

export type CreateEventSchema = z.infer<typeof eventSchema>;