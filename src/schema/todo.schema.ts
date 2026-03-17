import { z } from "zod";

const todoStatus = z.enum(["todo", "doing", "done", "not doing"]);

export const todoDTO = z.object({
  todoId: z.string(),
  todo: z.string(),
  status: todoStatus,
  task: z.uuid(),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createTodoPayload = z.object({
  todo: z.string(),
  task: z.string(),
  status: todoStatus.optional(),
  order: z.number().optional(),
});

export const updateTodoPayload = z
  .object({
    todo: z.string(),
    status: todoStatus,
    order: z.number(),
  })
  .partial();

export type TodoDTO = z.infer<typeof todoDTO>;
export type CreateTodoPayload = z.infer<typeof createTodoPayload>;
export type UpdateTodoPayload = z.infer<typeof updateTodoPayload>;
