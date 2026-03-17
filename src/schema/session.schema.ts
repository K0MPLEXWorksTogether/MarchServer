import { z } from "zod";

const timelineEvent = z.enum(["pause", "focus"]);

const pauseWindow = z.object({
  start: z.date().optional(),
  end: z.date().optional(),
});

const eventTimelineItem = z.object({
  event: timelineEvent,
  time: z.date(),
});

export const sessionDTO = z.object({
  sessionId: z.string(),
  user: z.string(),
  goal: z.string(),
  task: z.string(),
  startTime: z.date(),
  endTime: z.date(),
  duration: z.number(),
  pauses: pauseWindow,
  pausedTime: z.number(),
  focusTime: z.number(),
  eventTimeline: z.array(eventTimelineItem).nullable(),
  score: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  feeling: z.string().optional(),
});

export const createSessionPayload = sessionDTO.omit({ sessionId: true });

export const updateSessionPayload = z
  .object({
    endTime: z.date(),
    duration: z.number(),
    pauses: pauseWindow,
    pausedTime: z.number(),
    focusTime: z.number(),
    eventTimeline: z.array(eventTimelineItem).nullable(),
    score: z.union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
    ]),
    feeling: z.string(),
  })
  .partial();

export type SessionDTO = z.infer<typeof sessionDTO>;
export type CreateSessionPayload = z.infer<typeof createSessionPayload>;
export type UpdateSessionPayload = z.infer<typeof updateSessionPayload>;
