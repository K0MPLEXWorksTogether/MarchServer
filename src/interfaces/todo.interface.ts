import type {
  TodoDTO,
  CreateTodoPayload,
  UpdateTodoPayload,
} from "../schema/todo.schema";

export default interface ITodoInterface {
  createTodo(data: CreateTodoPayload): Promise<TodoDTO>;
  updateTodo(data: UpdateTodoPayload, id: string): Promise<TodoDTO>;
  getTodoById(id: string): Promise<TodoDTO | null>;
  getTodos(page: number, limit: number): Promise<TodoDTO[]>;
  deleteTodoById(id: string): Promise<TodoDTO>;
}
