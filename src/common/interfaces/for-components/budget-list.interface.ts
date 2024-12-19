import { FormInstance } from "antd";
import { UpdateBudgetDto } from "../api-requests-dtos/update-budget.dto";
import {
  IBudgetResponse,
  IBudgetResponseWithDates,
} from "../api-responses/budget.responses.interfaces";
import { IForSelect } from "./select.interface";

export interface IBudgetList {
  budgets: IBudgetResponseWithDates[];
  categories: IForSelect[];
  monthListForSelect: IForSelect[];
  budgetUpdateFunction: (
    budgetToUpdate: IBudgetResponseWithDates,
    updateBudgetDto: UpdateBudgetDto,
    form: FormInstance,
    handleRequestUpdateBudget: (
      request: () => Promise<IBudgetResponse | null>
    ) => Promise<IBudgetResponse | null>
  ) => Promise<void>;
  budgetDeleteFunction: (budget_id: string) => void;
}
