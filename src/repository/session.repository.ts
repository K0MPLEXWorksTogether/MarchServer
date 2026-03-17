import Session from "../models/Session";
import AppLogger from "../utils/logger";
import ISessionInterface from "../interfaces/session.interface";
import type {
  SessionDTO,
  CreateSessionPayload,
  UpdateSessionPayload,
} from "../schema/session.schema";
import { sessionDTO } from "../schema/session.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class SessionRepository implements ISessionInterface {
  private logger = AppLogger.getLogger();

  private toDTO(session: any): SessionDTO {
    const { _id, __v, user, goal, task, ...rest } = session.toObject();
    return sessionDTO.parse({
      sessionId: _id.toString(),
      user: user?.toString(),
      goal: goal?.toString(),
      task: task?.toString(),
      ...rest,
    });
  }

  public async createSession(data: CreateSessionPayload): Promise<SessionDTO> {
    try {
      const existingSession = await Session.exists({
        user: data.user,
        goal: data.goal,
        task: data.task,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      if (existingSession) {
        throw new InvalidError(
          `Session already exists for user: ${data.user}, goal: ${data.goal}, task: ${data.task}, startTime: ${data.startTime.toISOString()}`
        );
      }

      const session = await Session.create(data);
      this.logger.info(
        `[repo] createSession succedded. sessionId: ${session._id}`
      );
      return this.toDTO(session);
    } catch (err) {
      handleError(err, "createSession", this.logger);
    }
  }

  public async updateSession(
    data: UpdateSessionPayload,
    id: string
  ): Promise<SessionDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const isSessionPresent = await Session.exists({ _id: id });
      if (!isSessionPresent) {
        throw new InvalidError(`Session with id: ${id} does not exist`);
      }
      const updatedSession = await Session.findByIdAndUpdate(id, data, {
        new: true,
      });
      this.logger.info(`[repo] updateSession succedded. sessionId: ${id}`);
      return this.toDTO(updatedSession);
    } catch (err) {
      handleError(err, "updateSession", this.logger);
    }
  }

  public async getSessionById(id: string): Promise<SessionDTO | null> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const session = await Session.findById(id);
      if (!session) {
        return null;
      }
      this.logger.info(`[repo] getSessionById succedded. sessionId: ${id}`);
      return this.toDTO(session);
    } catch (err) {
      handleError(err, "getSessionById", this.logger);
    }
  }

  public async getSessions(page: number, limit: number): Promise<SessionDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }
      const offset = (page - 1) * limit;
      const sessions = await Session.find().skip(offset).limit(limit);
      this.logger.info("[repo] getSessions succedded");
      return sessions.map((session) => this.toDTO(session));
    } catch (err) {
      handleError(err, "getSessions", this.logger);
    }
  }

  public async deleteSessionById(id: string): Promise<SessionDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const deletedSession = await Session.findByIdAndDelete(id);
      if (!deletedSession) {
        throw new InvalidError(`Session with id: ${id} does not exist`);
      }
      this.logger.info(`[repo] deleteSessionById succedded. sessionId: ${id}`);
      return this.toDTO(deletedSession);
    } catch (err) {
      handleError(err, "deleteSessionById", this.logger);
    }
  }
}
