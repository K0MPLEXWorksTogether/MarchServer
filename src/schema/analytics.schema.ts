import { z } from "zod";

const taskDistributionSchema = z.object({
  task: z.string(),
  timeSpent: z.number(),
  efficiency: z.number(),
});

const goalDistributionSchema = z.object({
  task: z.string(),
  timeSpent: z.number(),
});

export const analyticsDTO = z.object({
  analyticsId: z.string(),
  user: z.string(),
  date: z.date(),
  totalFocusTime: z.number(),
  totalPausedTime: z.number(),
  sessions: z.number(),
  taskDistribution: z.array(taskDistributionSchema),
  goalDistribution: z.array(goalDistributionSchema),
  longestSession: z.number(),
  averageSessionLength: z.number(),
  averagePauseTime: z.number(),
});

export const createAnalyticsPayload = analyticsDTO
  .omit({ analyticsId: true })
  .partial({
    totalFocusTime: true,
    totalPausedTime: true,
    sessions: true,
    taskDistribution: true,
    goalDistribution: true,
    longestSession: true,
    averageSessionLength: true,
    averagePauseTime: true,
  });

export const updateAnalyticsPayload = analyticsDTO
  .pick({
    totalFocusTime: true,
    totalPausedTime: true,
    sessions: true,
    taskDistribution: true,
    goalDistribution: true,
    longestSession: true,
    averageSessionLength: true,
    averagePauseTime: true,
  })
  .partial();

export type AnalyticsDTO = z.infer<typeof analyticsDTO>;
export type CreateAnalyticsPayload = z.infer<typeof createAnalyticsPayload>;
export type UpdateAnalyticsPayload = z.infer<typeof updateAnalyticsPayload>;
