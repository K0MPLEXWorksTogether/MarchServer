import Task from "../models/Task";
import AppLogger from "../utils/logger";
import ITaskInterface from "../interfaces/task.interface";
import type {
  TaskDTO,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "../schema/task.schema";
import { taskDTO } from "../schema/task.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class TaskRepository implements ITaskInterface {
  private logger = AppLogger.getLogger();

  private toDTO(task: any): TaskDTO {
    const { _id, __v, goal, ...rest } = task.toObject();
    return taskDTO.parse({
      taskId: _id.toString(),
      goal: goal?.toString(),
      ...rest,
    });
  }

  public async createTask(data: CreateTaskPayload): Promise<TaskDTO> {
    try {
      const existingTask = await Task.exists({
        goal: data.goal,
        taskName: data.taskName,
      });
      if (existingTask) {
        throw new InvalidError(
          `Task with taskName: ${data.taskName} already exists for goal: ${data.goal}`
        );
      }

      const task = await Task.create(data);
      this.logger.info(`[repo] createTask succedded. taskId: ${task._id}`);
      return this.toDTO(task);
    } catch (err) {
      handleError(err, "createTask", this.logger);
    }
  }

  public async updateTask(
    data: UpdateTaskPayload,
    id: string
  ): Promise<TaskDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const isTaskPresent = await Task.exists({ _id: id });
      if (!isTaskPresent) {
        throw new InvalidError(`Task with id: ${id} does not exist`);
      }
      const updatedTask = await Task.findByIdAndUpdate(id, data, { new: true });
      if (!updatedTask) {
        throw new InvalidError(`Task with id: ${id} does not exist`);
      }
      this.logger.info(`[repo] updateTask succedded. taskId: ${id}`);
      return this.toDTO(updatedTask);
    } catch (err) {
      handleError(err, "updateTask", this.logger);
    }
  }

  public async getTaskById(id: string): Promise<TaskDTO | null> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const task = await Task.findById(id);
      if (!task) {
        return null;
      }
      this.logger.info(`[repo] getTaskById succedded. taskId: ${id}`);
      return this.toDTO(task);
    } catch (err) {
      handleError(err, "getTaskById", this.logger);
    }
  }

  public async getTasks(page: number, limit: number): Promise<TaskDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }
      const offset = (page - 1) * limit;
      const tasks = await Task.find().skip(offset).limit(limit);
      this.logger.info("[repo] getTasks succedded");
      return tasks.map((task) => this.toDTO(task));
    } catch (err) {
      handleError(err, "getTasks", this.logger);
    }
  }

  public async deleteTaskById(id: string): Promise<TaskDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        throw new InvalidError(`Task with id: ${id} does not exist`);
      }
      this.logger.info(`[repo] deleteTaskById succedded. taskId: ${id}`);
      return this.toDTO(deletedTask);
    } catch (err) {
      handleError(err, "deleteTaskById", this.logger);
    }
  }

  public async spendTime(id: string, time: number): Promise<TaskDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      if (time < 0) {
        throw new InvalidError(`time cannot be negative: ${time}`);
      }

      const task = await Task.findById(id);
      if (!task) {
        throw new InvalidError(`Task with id: ${id} does not exist`);
      }

      task.spentTime += time;
      await task.save();

      this.logger.info(`[repo] spendTime succedded. taskId: ${id}`);
      return this.toDTO(task);
    } catch (err) {
      handleError(err, "spendTime", this.logger);
    }
  }

  public async updateStatus(id: string, status: string): Promise<TaskDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }

      const allowedStatuses = ["todo", "doing", "done", "not doing"] as const;
      if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
        throw new InvalidError(`Invalid status: ${status}`);
      }

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updatedTask) {
        throw new InvalidError(`Task with id: ${id} does not exist`);
      }

      this.logger.info(`[repo] updateStatus succedded. taskId: ${id}`);
      return this.toDTO(updatedTask);
    } catch (err) {
      handleError(err, "updateStatus", this.logger);
    }
  }
}
