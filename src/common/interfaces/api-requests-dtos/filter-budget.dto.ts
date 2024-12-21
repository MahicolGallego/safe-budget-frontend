import { budgetStatus } from "../../constants/enums/budget-status.enum";

export interface FilterBudgetDto {
  category?: string;
  month?: number | "";
  status?: budgetStatus | "";
}
