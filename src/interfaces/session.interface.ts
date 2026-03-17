import type {
  SessionDTO,
  CreateSessionPayload,
  UpdateSessionPayload,
} from "../schema/session.schema";

export default interface ISessionInterface {
  createSession(data: CreateSessionPayload): Promise<SessionDTO>;
  updateSession(data: UpdateSessionPayload, id: string): Promise<SessionDTO>;
  getSessionById(id: string): Promise<SessionDTO | null>;
  getSessions(page: number, limit: number): Promise<SessionDTO[]>;
  deleteSessionById(id: string): Promise<SessionDTO>;
}
