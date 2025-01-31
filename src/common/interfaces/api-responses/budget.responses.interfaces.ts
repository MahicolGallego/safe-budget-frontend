import { budgetStatus } from "../../constants/enums/budget-status.enum";
import { ICategoryResponse } from "./categories.responses.interfaces";

export interface IBudgetResponse {
  id: string;
  name: string;
  amount: number;
  start_date: string;
  end_date: string;
  status: budgetStatus;
  category: ICategoryResponse;
}

export interface IBudgetResponseWithDates
  extends Omit<IBudgetResponse, "start_date" | "end_date"> {
  start_date: Date;
  end_date: Date;
}

export interface IBudgetBalanceResponse {
  initial_amount: number;
  spent_amount: number;
  percentage_spent_amount: number;
  remaining_amount: number;
  percentage_remaining_amount: number;
}
