import { IBudgetResponseWithDates } from "../api-responses/budget.responses.interfaces";
import { IBudgetList } from "./budget-list.interface";

export interface IBudgetCard extends Omit<IBudgetList, "budgets"> {
  budget: IBudgetResponseWithDates;
}
