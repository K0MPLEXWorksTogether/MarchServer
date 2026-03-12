import type {
  CreateUserPayload,
  UpdateUserPayload,
  UserDTO,
} from "../schema/user.schema";

export default interface IUserInterface {
  createUser(data: CreateUserPayload): Promise<UserDTO>;
  updateUser(data: UpdateUserPayload, id: string): Promise<UserDTO>;
  getUserById(id: string): Promise<null | UserDTO>;
  getUsers(page: number, limit: number): Promise<UserDTO[]>;
  deleteUserById(id: string): Promise<UserDTO>;
  getUserByEmail(email: string): Promise<UserDTO | null>;
}
