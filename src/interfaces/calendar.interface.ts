import type {
  CalendarDTO,
  CreateCalendarPayload,
  UpdateCalendarPayload,
} from "../schema/calendar.schema";

export default interface ICalendarInterface {
  createCalendar(data: CreateCalendarPayload): Promise<CalendarDTO>;
  updateCalendar(data: UpdateCalendarPayload, id: string): Promise<CalendarDTO>;
  getCalendarById(id: string): Promise<CalendarDTO | null>;
  getCalendars(page: number, limit: number): Promise<CalendarDTO[]>;
  deleteCalendarById(id: string): Promise<CalendarDTO>;
}
