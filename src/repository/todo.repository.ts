import Todo from "../models/Todo";
import AppLogger from "../utils/logger";
import ITodoInterface from "../interfaces/todo.interface";
import type {
  TodoDTO,
  CreateTodoPayload,
  UpdateTodoPayload,
} from "../schema/todo.schema";
import { todoDTO } from "../schema/todo.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class TodoRepository implements ITodoInterface {
  private logger = AppLogger.getLogger();

  private toDTO(todo: any): TodoDTO {
    const { _id, __v, task, ...rest } = todo.toObject();
    return todoDTO.parse({
      todoId: _id.toString(),
      task: task?.toString(),
      ...rest,
    });
  }

  public async createTodo(data: CreateTodoPayload): Promise<TodoDTO> {
    try {
      const existingTodo = await Todo.exists({
        task: data.task,
        todo: data.todo,
      });
      if (existingTodo) {
        throw new InvalidError(
          `Todo already exists for task: ${data.task} with todo: ${data.todo}`
        );
      }

      const todo = await Todo.create(data);
      this.logger.info(`[repo] createTodo succedded. todoId: ${todo._id}`);
      return this.toDTO(todo);
    } catch (err) {
      handleError(err, "createTodo", this.logger);
    }
  }

  public async updateTodo(
    data: UpdateTodoPayload,
    id: string
  ): Promise<TodoDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const isTodoPresent = await Todo.exists({ _id: id });
      if (!isTodoPresent) {
        throw new InvalidError(`Todo with id: ${id} does not exist`);
      }
      const updatedTodo = await Todo.findByIdAndUpdate(id, data, { new: true });
      this.logger.info(`[repo] updateTodo succedded. todoId: ${id}`);
      return this.toDTO(updatedTodo);
    } catch (err) {
      handleError(err, "updateTodo", this.logger);
    }
  }

  public async getTodoById(id: string): Promise<TodoDTO | null> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const todo = await Todo.findById(id);
      if (!todo) {
        return null;
      }
      this.logger.info(`[repo] getTodoById succedded. todoId: ${id}`);
      return this.toDTO(todo);
    } catch (err) {
      handleError(err, "getTodoById", this.logger);
    }
  }

  public async getTodos(page: number, limit: number): Promise<TodoDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }
      const offset = (page - 1) * limit;
      const todos = await Todo.find().skip(offset).limit(limit);
      this.logger.info("[repo] getTodos succedded");
      return todos.map((todo) => this.toDTO(todo));
    } catch (err) {
      handleError(err, "getTodos", this.logger);
    }
  }

  public async deleteTodoById(id: string): Promise<TodoDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const deletedTodo = await Todo.findByIdAndDelete(id);
      if (!deletedTodo) {
        throw new InvalidError(`Todo with id: ${id} does not exist`);
      }
      this.logger.info(`[repo] deleteTodoById succedded. todoId: ${id}`);
      return this.toDTO(deletedTodo);
    } catch (err) {
      handleError(err, "deleteTodoById", this.logger);
    }
  }
}
