import type {
  EventDTO,
  CreateEventPayload,
  UpdateEventPayload,
} from "../schema/event.schema";

export default interface IEventInterface {
  createEvent(data: CreateEventPayload): Promise<EventDTO>;
  updateEvent(data: UpdateEventPayload, id: string): Promise<EventDTO>;
  getEventById(id: string): Promise<EventDTO | null>;
  getEvents(page: number, limit: number): Promise<EventDTO[]>;
  deleteEventById(id: string): Promise<EventDTO>;
}
