import { z } from "zod";

export const goalDTO = z.object({
  goalId: z.string(),
  goalName: z.string(),
  user: z.string(),
  allocatedTime: z.number(),
  description: z.optional(z.string()),
  remainingTime: z.number(),
  label: z.optional(z.string()),
  timeRemainingForTasks: z.number(),
  status: z.enum(["todo", "doing", "done", "not doing"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createGoalPayload = goalDTO.omit({
  goalId: true,
  remainingTime: true,
  timeRemainingForTasks: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const updateGoalPayload = goalDTO.pick({
  goalName: true,
  allocatedTime: true,
  description: true,
  label: true,
  status: true,
}).partial();

export type CreateGoalPayload = z.infer<typeof createGoalPayload>;
export type UpdateGoalPayload = z.infer<typeof updateGoalPayload>;
export type GoalDTO = z.infer<typeof goalDTO>;
