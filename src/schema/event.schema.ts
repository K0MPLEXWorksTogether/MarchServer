import { z } from "zod";

export const eventDTO = z.object({
  eventId: z.string(),
  eventName: z.string(),
  task: z.string(),
  description: z.string().optional(),
  eventStart: z.date(),
  eventEnd: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createEventPayload = z.object({
  eventName: z.string(),
  task: z.string(),
  description: z.string().optional(),
  eventStart: z.date(),
  eventEnd: z.date().optional(),
});

export const updateEventPayload = z
  .object({
    eventName: z.string(),
    description: z.string(),
    eventStart: z.date(),
    eventEnd: z.date(),
  })
  .partial();

export type EventDTO = z.infer<typeof eventDTO>;
export type CreateEventPayload = z.infer<typeof createEventPayload>;
export type UpdateEventPayload = z.infer<typeof updateEventPayload>;
