import { z } from "zod";

export const calendarDTO = z.object({
  calendarId: z.string(),
  user: z.string(),
  events: z.array(z.string()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCalendarPayload = z.object({
  user: z.string(),
  events: z.array(z.string()).optional(),
});

export const updateCalendarPayload = z
  .object({
    events: z.array(z.string()),
  })
  .partial();

export type CalendarDTO = z.infer<typeof calendarDTO>;
export type CreateCalendarPayload = z.infer<typeof createCalendarPayload>;
export type UpdateCalendarPayload = z.infer<typeof updateCalendarPayload>;
