import type {
  TaskDTO,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "../schema/task.schema";

export default interface ITaskInterface {
  createTask(data: CreateTaskPayload): Promise<TaskDTO>;
  updateTask(data: UpdateTaskPayload, id: string): Promise<TaskDTO>;
  getTaskById(id: string): Promise<TaskDTO | null>;
  getTasks(page: number, limit: number): Promise<TaskDTO[]>;
  deleteTaskById(id: string): Promise<TaskDTO>;
  spendTime(id: string, time: number): Promise<TaskDTO>;
  updateStatus(id: string, status: string): Promise<TaskDTO>;
}
