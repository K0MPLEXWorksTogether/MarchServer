import type {
  AnalyticsDTO,
  CreateAnalyticsPayload,
  UpdateAnalyticsPayload,
} from "../schema/analytics.schema";

export default interface IAnalyticsInterface {
  createAnalytics(data: CreateAnalyticsPayload): Promise<AnalyticsDTO>;
  updateAnalytics(
    data: UpdateAnalyticsPayload,
    id: string
  ): Promise<AnalyticsDTO>;
  getAnalyticsById(id: string): Promise<AnalyticsDTO | null>;
  getAnalytics(page: number, limit: number): Promise<AnalyticsDTO[]>;
  deleteAnalyticsById(id: string): Promise<AnalyticsDTO>;
}
