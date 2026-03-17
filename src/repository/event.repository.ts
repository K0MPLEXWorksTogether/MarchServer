import Event from "../models/Event";
import AppLogger from "../utils/logger";
import IEventInterface from "../interfaces/event.interface";
import type {
  EventDTO,
  CreateEventPayload,
  UpdateEventPayload,
} from "../schema/event.schema";
import { eventDTO } from "../schema/event.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class EventRepository implements IEventInterface {
  private logger = AppLogger.getLogger();

  private toDTO(event: any): EventDTO {
    const { _id, __v, task, ...rest } = event.toObject();
    return eventDTO.parse({
      eventId: _id.toString(),
      task: task?.toString(),
      ...rest,
    });
  }

  public async createEvent(data: CreateEventPayload): Promise<EventDTO> {
    try {
      const existingEvent = await Event.exists({
        task: data.task,
        eventName: data.eventName,
        eventStart: data.eventStart,
      });
      if (existingEvent) {
        throw new InvalidError(
          `Event already exists for task: ${data.task}, eventName: ${data.eventName}, eventStart: ${data.eventStart.toISOString()}`
        );
      }

      const event = await Event.create(data);
      this.logger.info(`[repo] createEvent succedded. eventId: ${event._id}`);
      return this.toDTO(event);
    } catch (err) {
      handleError(err, "createEvent", this.logger);
    }
  }

  public async updateEvent(
    data: UpdateEventPayload,
    id: string
  ): Promise<EventDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const isEventPresent = await Event.exists({ _id: id });
      if (!isEventPresent) {
        throw new InvalidError(`Event with id: ${id} does not exist`);
      }
      const updatedEvent = await Event.findByIdAndUpdate(id, data, { new: true });
      this.logger.info(`[repo] updateEvent succedded. eventId: ${id}`);
      return this.toDTO(updatedEvent);
    } catch (err) {
      handleError(err, "updateEvent", this.logger);
    }
  }

  public async getEventById(id: string): Promise<EventDTO | null> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const event = await Event.findById(id);
      if (!event) {
        return null;
      }
      this.logger.info(`[repo] getEventById succedded. eventId: ${id}`);
      return this.toDTO(event);
    } catch (err) {
      handleError(err, "getEventById", this.logger);
    }
  }

  public async getEvents(page: number, limit: number): Promise<EventDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }
      const offset = (page - 1) * limit;
      const events = await Event.find().skip(offset).limit(limit);
      this.logger.info("[repo] getEvents succedded");
      return events.map((event) => this.toDTO(event));
    } catch (err) {
      handleError(err, "getEvents", this.logger);
    }
  }

  public async deleteEventById(id: string): Promise<EventDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const deletedEvent = await Event.findByIdAndDelete(id);
      if (!deletedEvent) {
        throw new InvalidError(`Event with id: ${id} does not exist`);
      }
      this.logger.info(`[repo] deleteEventById succedded. eventId: ${id}`);
      return this.toDTO(deletedEvent);
    } catch (err) {
      handleError(err, "deleteEventById", this.logger);
    }
  }
}
