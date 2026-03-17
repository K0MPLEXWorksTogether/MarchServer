import {
  CreateGoalPayload,
  UpdateGoalPayload,
  GoalDTO,
} from "../schema/goal.schema";

export interface IGoalInterface {
  createGoal(data: CreateGoalPayload): Promise<GoalDTO>;
  updateGoal(data: UpdateGoalPayload, id: string): Promise<GoalDTO>;
  getGoalById(id: string): Promise<GoalDTO>;
  getGoals(page: number, limit: number): Promise<GoalDTO[]>;
  deleteGoalById(id: string): Promise<GoalDTO>;

  updateRemainingTime(id: string, timeSpent: number): Promise<GoalDTO>;
  updateTimeRemainingForTasks(
    id: string,
    timeAlloted: number
  ): Promise<GoalDTO>;
  updateStatus(id: string, status: string): Promise<GoalDTO>;
}
