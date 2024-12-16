import { FormInstance } from "antd";
import { UpdateBudgetDto } from "../api-requests-dtos/update-budget.dto";
import { IBudgetResponse } from "../api-responses/budget.responses.interfaces";

export interface IBudgetList {
  budgets: IBudgetResponse[];
  updateFunction: (
    budgetToUpdate: IBudgetResponse,
    updateBudgetDto: UpdateBudgetDto,
    form: FormInstance
  ) => void;
  deleteFunction: (budget_id: string) => void;
}
