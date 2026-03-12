import User from "../models/User";
import AppLogger from "../utils/logger";
import IUserInterface from "../interfaces/user.interface";
import type {
  UserDTO,
  CreateUserPayload,
  UpdateUserPayload,
} from "../schema/user.schema";
import {
  userDTO,
  createUserPayload,
  updateUserPayload,
} from "../schema/user.schema";
import { InvalidError } from "../types/errors";

export default class UserRepository implements IUserInterface {
  private logger = AppLogger.getLogger();

  private toDTO(user: any): UserDTO {
    const { _id, passwordHash, __v, ...rest } = user;

    return userDTO.parse({
      userId: _id.toString(),
      ...rest,
    });
  }

  private handleError(err: any, task: string): never {
    if (err instanceof InvalidError) {
      this.logger.error(`[repo] (documented) ${task} failed: ${err.message}`);
      throw err;
    } else {
      this.logger.error(`[repo] ${task} failed: ${err.message}`);
      throw err;
    }
  }

  public async createUser(data: CreateUserPayload): Promise<UserDTO> {
    try {
      const existingUser = await User.find({ email: data.email });
      if (existingUser) {
        throw new InvalidError(`User with email: ${data.email} already exists`);
      }
      const user = await User.create(data);
      this.logger.info(`[repo] createUser succedded. userId: ${user._id}`);
      return this.toDTO(user);
    } catch (err: any) {
      this.handleError(err, "createUser");
    }
  }

  public async updateUser(
    data: UpdateUserPayload,
    id: string
  ): Promise<UserDTO> {
    try {
      const isUserPresent = await User.exists({ _id: id });
      if (!isUserPresent) {
        throw new InvalidError(`User with id: ${id} does not exist`);
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      this.logger.info(`[repo] updateUser succedded. userId: ${id}`);
      return this.toDTO(updatedUser);
    } catch (err: any) {
      this.handleError(err, "updateUser");
    }
  }

  public async getUserById(id: string): Promise<null | UserDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }

      const user = await User.findById(id);
      this.logger.info(`[repo] getUserById succedded. userId: ${id}`);
      return this.toDTO(user);
    } catch (err) {
      this.handleError(err, "getUserById");
    }
  }

  public async getUserByEmail(email: string): Promise<UserDTO | null> {
    try {
      if (!email) {
        throw new InvalidError(`${email} is falsy`);
      }

      const user = await User.findOne({ email: email });
      this.logger.info(`[repo] getUserByEmail succedded. userId: ${user?._id}`);
      return this.toDTO(user);
    } catch (err) {
      this.handleError(err, "getUserByMail");
    }
  }

  public async getUsers(page: number, limit: number): Promise<UserDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }

      const offset: number = (page - 1) * limit;
      const users = await User.find().skip(offset).limit(limit);
      this.logger.info(`[repo] getUsers succedded`);
      return users.map((user) => this.toDTO(user));
    } catch (err) {
      this.handleError(err, "getUsers");
    }
  }

  public async deleteUserById(id: string): Promise<UserDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }

      const deletedUser = await User.findByIdAndDelete(id);
      this.logger.info(`[repo] deleteUserById succedded. userId: ${id}`);
      return this.toDTO(deletedUser);
    } catch (err) {
      this.handleError(err, "deleteUserById");
    }
  }
}
