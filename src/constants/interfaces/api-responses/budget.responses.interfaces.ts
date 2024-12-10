import { budgetStatus } from "../../enums/budget-status.enum";
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
