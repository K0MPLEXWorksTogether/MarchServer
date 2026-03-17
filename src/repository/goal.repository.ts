import Goal from "../models/Goal";
import AppLogger from "../utils/logger";
import { IGoalInterface } from "../interfaces/goal.interface";
import type {
  CreateGoalPayload,
  UpdateGoalPayload,
  GoalDTO,
} from "../schema/goal.schema";
import { goalDTO } from "../schema/goal.schema";
import { InvalidError } from "../types/errors";
import { handleError } from "../utils/common";

export default class GoalRepository implements IGoalInterface {
  private logger = AppLogger.getLogger();

  private toDTO(goal: any): GoalDTO {
    const { _id, __v, user, ...rest } = goal.toObject();
    return goalDTO.parse({
      goalId: _id.toString(),
      user: user?.toString(),
      ...rest,
    });
  }

  public async createGoal(data: CreateGoalPayload): Promise<GoalDTO> {
    try {
      const existingGoal = await Goal.exists({
        goalName: data.goalName,
        user: data.user,
      });
      if (existingGoal) {
        throw new InvalidError(
          `Goal with goalName: ${data.goalName} already exists for user: ${data.user}`
        );
      }

      const newGoal = await Goal.create(data);
      this.logger.info(`[repo] createGoal succedded. goalId: ${newGoal._id}`);
      return this.toDTO(newGoal);
    } catch (err) {
      handleError(err, "createGoal", this.logger);
    }
  }

  public async updateGoal(
    data: UpdateGoalPayload,
    id: string
  ): Promise<GoalDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }

      const existingGoal = await Goal.exists({ _id: id });
      if (!existingGoal) {
        throw new InvalidError(`Goal with id: ${id} does not exist`);
      }

      const updatedGoal = await Goal.findByIdAndUpdate(id, data, { new: true });
      if (!updatedGoal) {
        throw new InvalidError(`Goal with id: ${id} does not exist`);
      }

      this.logger.info(`[repo] updateGoal succedded. goalId: ${id}`);
      return this.toDTO(updatedGoal);
    } catch (err) {
      handleError(err, "updateGoal", this.logger);
    }
  }

  public async getGoalById(id: string): Promise<GoalDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }

      const goal = await Goal.findById(id);
      if (!goal) {
        throw new InvalidError(`Goal with id: ${id} does not exist`);
      }

      this.logger.info(`[repo] getGoalById succedded. goalId: ${id}`);
      return this.toDTO(goal);
    } catch (err) {
      handleError(err, "getGoalById", this.logger);
    }
  }

  public async getGoals(page: number, limit: number): Promise<GoalDTO[]> {
    try {
      if (!page || !limit) {
        throw new InvalidError(`${page} or ${limit} is falsy`);
      }

      const offset = (page - 1) * limit;
      const goals = await Goal.find().skip(offset).limit(limit);

      this.logger.info("[repo] getGoals succedded");
      return goals.map((goal) => this.toDTO(goal));
    } catch (err) {
      handleError(err, "getGoals", this.logger);
    }
  }

  public async deleteGoalById(id: string): Promise<GoalDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }

      const deletedGoal = await Goal.findByIdAndDelete(id);
      if (!deletedGoal) {
        throw new InvalidError(`Goal with id: ${id} does not exist`);
      }

      this.logger.info(`[repo] deleteGoalById succedded. goalId: ${id}`);
      return this.toDTO(deletedGoal);
    } catch (err) {
      handleError(err, "deleteGoalById", this.logger);
    }
  }

  public async updateRemainingTime(
    id: string,
    timeSpent: number
  ): Promise<GoalDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      if (timeSpent < 0) {
        throw new InvalidError(`timeSpent cannot be negative: ${timeSpent}`);
      }

      const goal = await Goal.findById(id);
      if (!goal) {
        throw new InvalidError(`Goal with id: ${id} does not exist`);
      }

      const nextRemainingTime = goal.remainingTime - timeSpent;
      if (nextRemainingTime < 0) {
        throw new InvalidError(
          `remainingTime cannot go below 0 for goal id: ${id}`
        );
      }

      goal.remainingTime = nextRemainingTime;
      await goal.save();

      this.logger.info(`[repo] updateRemainingTime succedded. goalId: ${id}`);
      return this.toDTO(goal);
    } catch (err) {
      handleError(err, "updateRemainingTime", this.logger);
    }
  }

  public async updateTimeRemainingForTasks(
    id: string,
    timeAlloted: number
  ): Promise<GoalDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }
      if (timeAlloted < 0) {
        throw new InvalidError(`timeAlloted cannot be negative: ${timeAlloted}`);
      }

      const goal = await Goal.findById(id);
      if (!goal) {
        throw new InvalidError(`Goal with id: ${id} does not exist`);
      }

      const nextTimeRemainingForTasks = goal.timeRemainingForTasks - timeAlloted;
      if (nextTimeRemainingForTasks < 0) {
        throw new InvalidError(
          `timeRemainingForTasks cannot go below 0 for goal id: ${id}`
        );
      }

      goal.timeRemainingForTasks = nextTimeRemainingForTasks;
      await goal.save();

      this.logger.info(
        `[repo] updateTimeRemainingForTasks succedded. goalId: ${id}`
      );
      return this.toDTO(goal);
    } catch (err) {
      handleError(err, "updateTimeRemainingForTasks", this.logger);
    }
  }

  public async updateStatus(id: string, status: string): Promise<GoalDTO> {
    try {
      if (!id) {
        throw new InvalidError(`${id} is falsy`);
      }

      const allowedStatuses = ["todo", "doing", "done", "not doing"] as const;
      if (!allowedStatuses.includes(status as (typeof allowedStatuses)[number])) {
        throw new InvalidError(`Invalid status: ${status}`);
      }

      const updatedGoal = await Goal.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );
      if (!updatedGoal) {
        throw new InvalidError(`Goal with id: ${id} does not exist`);
      }

      this.logger.info(`[repo] updateStatus succedded. goalId: ${id}`);
      return this.toDTO(updatedGoal);
    } catch (err) {
      handleError(err, "updateStatus", this.logger);
    }
  }
}
