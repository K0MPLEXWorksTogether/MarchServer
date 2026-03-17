import Analytics from "../models/Analytics";
import AppLogger from "../utils/logger";
import IAnalyticsInterface from "../interfaces/analytics.interface";
import type {
  AnalyticsDTO,
  CreateAnalyticsPayload,
  UpdateAnalyticsPayload,
} from "../schema/analytics.schema";
import { analyticsDTO } from "../schema/analytics.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class AnalyticsRepository implements IAnalyticsInterface {
  private logger = AppLogger.getLogger();

  private toDTO(analytics: any): AnalyticsDTO {
    const { _id, __v, user, taskDistribution, goalDistribution, ...rest } =
      analytics.toObject();
    return analyticsDTO.parse({
      analyticsId: _id.toString(),
      user: user?.toString(),
      taskDistribution: (taskDistribution ?? []).map((dist: any) => ({
        task: dist.task?.toString(),
        timeSpent: dist.timeSpent,
        efficiency: dist.efficiency,
      })),
      goalDistribution: (goalDistribution ?? []).map((dist: any) => ({
        task: dist.task?.toString(),
        timeSpent: dist.timeSpent,
      })),
      ...rest,
    });
  }

  public async createAnalytics(
    data: CreateAnalyticsPayload
  ): Promise<AnalyticsDTO> {
    try {
      const existingAnalytics = await Analytics.exists({
        user: data.user,
        date: data.date,
      });
      if (existingAnalytics) {
        throw new InvalidError(
          `Analytics already exists for user: ${data.user} on date: ${data.date.toISOString()}`
        );
      }

      const analytics = await Analytics.create(data);
      this.logger.info(
        `[repo] createAnalytics succedded. analyticsId: ${analytics._id}`
      );
      return this.toDTO(analytics);
    } catch (err) {
      handleError(err, "createAnalytics", this.logger);
    }
  }

  public async updateAnalytics(
    data: UpdateAnalyticsPayload,
    id: string
  ): Promise<AnalyticsDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const isAnalyticsPresent = await Analytics.exists({ _id: id });
      if (!isAnalyticsPresent) {
        throw new InvalidError(`Analytics with id: ${id} does not exist`);
      }
      const updatedAnalytics = await Analytics.findByIdAndUpdate(id, data, {
        new: true,
      });
      this.logger.info(`[repo] updateAnalytics succedded. analyticsId: ${id}`);
      return this.toDTO(updatedAnalytics);
    } catch (err) {
      handleError(err, "updateAnalytics", this.logger);
    }
  }

  public async getAnalyticsById(id: string): Promise<AnalyticsDTO | null> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const analytics = await Analytics.findById(id);
      if (!analytics) {
        return null;
      }
      this.logger.info(`[repo] getAnalyticsById succedded. analyticsId: ${id}`);
      return this.toDTO(analytics);
    } catch (err) {
      handleError(err, "getAnalyticsById", this.logger);
    }
  }

  public async getAnalytics(
    page: number,
    limit: number
  ): Promise<AnalyticsDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }
      const offset = (page - 1) * limit;
      const analytics = await Analytics.find().skip(offset).limit(limit);
      this.logger.info("[repo] getAnalytics succedded");
      return analytics.map((item) => this.toDTO(item));
    } catch (err) {
      handleError(err, "getAnalytics", this.logger);
    }
  }

  public async deleteAnalyticsById(id: string): Promise<AnalyticsDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      const deletedAnalytics = await Analytics.findByIdAndDelete(id);
      if (!deletedAnalytics) {
        throw new InvalidError(`Analytics with id: ${id} does not exist`);
      }
      this.logger.info(
        `[repo] deleteAnalyticsById succedded. analyticsId: ${id}`
      );
      return this.toDTO(deletedAnalytics);
    } catch (err) {
      handleError(err, "deleteAnalyticsById", this.logger);
    }
  }
}
