import { z } from "zod";

const taskStatus = z.enum(["todo", "doing", "done", "not doing"]);

export const taskDTO = z.object({
  taskId: z.string(),
  taskName: z.string(),
  allocatedTime: z.number(),
  goal: z.string(),
  spentTime: z.number(),
  description: z.string(),
  status: taskStatus,
  priority: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTaskPayload = z.object({
  taskName: z.string(),
  allocatedTime: z.number(),
  goal: z.string(),
  description: z.string().optional(),
  status: taskStatus.optional(),
  priority: z.number().optional(),
});

export const updateTaskPayload = z
  .object({
    taskName: z.string(),
    allocatedTime: z.number(),
    spentTime: z.number(),
    description: z.string(),
    status: taskStatus,
    priority: z.number(),
  })
  .partial();

export type TaskDTO = z.infer<typeof taskDTO>;
export type CreateTaskPayload = z.infer<typeof createTaskPayload>;
export type UpdateTaskPayload = z.infer<typeof updateTaskPayload>;
