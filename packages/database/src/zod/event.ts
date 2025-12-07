import { z } from "zod";
import { EventType } from "../../generated/prisma/client";

export const eventSchema = z.object({
  id: z.cuid(),
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().nullish(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  type: z.enum(EventType),
  createdAt: z.date(),
  updatedAt: z.date(),
});


export const createEventSchema = eventSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
}).refine((data) => data.endTime > data.startTime, {
  message: "종료 시간은 시작 시간보다 이후여야 합니다.",
  path: ["endTime"],
});

export type EventSchema = z.infer<typeof eventSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;