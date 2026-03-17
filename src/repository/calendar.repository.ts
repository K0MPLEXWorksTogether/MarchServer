import Calendar from "../models/Calendar";
import AppLogger from "../utils/logger";
import ICalendarInterface from "../interfaces/calendar.interface";
import type {
  CalendarDTO,
  CreateCalendarPayload,
  UpdateCalendarPayload,
} from "../schema/calendar.schema";
import { calendarDTO } from "../schema/calendar.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class CalendarRepository implements ICalendarInterface {
  private logger = AppLogger.getLogger();

  private toDTO(calendar: any): CalendarDTO {
    const { _id, __v, user, events, ...rest } = calendar.toObject();
    return calendarDTO.parse({
      calendarId: _id.toString(),
      user: user?.toString(),
      events: (events ?? []).map((eventId: any) => eventId.toString()),
      ...rest,
    });
  }

  public async createCalendar(
    data: CreateCalendarPayload
  ): Promise<CalendarDTO> {
    try {
      const existingCalendar = await Calendar.exists({ user: data.user });
      if (existingCalendar) {
        throw new InvalidError(`Calendar for user: ${data.user} already exists`);
      }

      const calendar = await Calendar.create(data);
      this.logger.info(
        `[repo] createCalendar succedded. calendarId: ${calendar._id}`
      );
      return this.toDTO(calendar);
    } catch (err) {
      handleError(err, "createCalendar", this.logger);
    }
  }

  public async updateCalendar(
    data: UpdateCalendarPayload,
    id: string
  ): Promise<CalendarDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const isCalendarPresent = await Calendar.exists({ _id: id });
      if (!isCalendarPresent) {
        throw new InvalidError(`Calendar with id: ${id} does not exist`);
      }
      const updatedCalendar = await Calendar.findByIdAndUpdate(id, data, {
        new: true,
      });
      this.logger.info(`[repo] updateCalendar succedded. calendarId: ${id}`);
      return this.toDTO(updatedCalendar);
    } catch (err) {
      handleError(err, "updateCalendar", this.logger);
    }
  }

  public async getCalendarById(id: string): Promise<CalendarDTO | null> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const calendar = await Calendar.findById(id);
      if (!calendar) {
        return null;
      }
      this.logger.info(`[repo] getCalendarById succedded. calendarId: ${id}`);
      return this.toDTO(calendar);
    } catch (err) {
      handleError(err, "getCalendarById", this.logger);
    }
  }

  public async getCalendars(
    page: number,
    limit: number
  ): Promise<CalendarDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }
      const offset = (page - 1) * limit;
      const calendars = await Calendar.find().skip(offset).limit(limit);
      this.logger.info("[repo] getCalendars succedded");
      return calendars.map((calendar) => this.toDTO(calendar));
    } catch (err) {
      handleError(err, "getCalendars", this.logger);
    }
  }

  public async deleteCalendarById(id: string): Promise<CalendarDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const deletedCalendar = await Calendar.findByIdAndDelete(id);
      if (!deletedCalendar) {
        throw new InvalidError(`Calendar with id: ${id} does not exist`);
      }
      this.logger.info(`[repo] deleteCalendarById succedded. calendarId: ${id}`);
      return this.toDTO(deletedCalendar);
    } catch (err) {
      handleError(err, "deleteCalendarById", this.logger);
    }
  }
}
