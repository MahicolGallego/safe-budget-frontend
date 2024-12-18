import { BudgetsApi } from "../config/api/BudgetsApi";
import { CreateBudgetDto } from "../common/interfaces/api-requests-dtos/create-budget.dto";
import { FilterBudgetDto } from "../common/interfaces/api-requests-dtos/filter-budget.dto";
import { UpdateBudgetDto } from "../common/interfaces/api-requests-dtos/update-budget.dto";
import { IBudgetResponse } from "../common/interfaces/api-responses/budget.responses.interfaces";

export const createBudget = async (
  createBudgetDto: CreateBudgetDto
): Promise<IBudgetResponse | null> => {
  try {
    const { data } = await BudgetsApi.post<IBudgetResponse>(
      "/budgets",
      createBudgetDto
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const findAllBudgets = async (
  filterOptions: FilterBudgetDto
): Promise<IBudgetResponse[] | null> => {
  try {
    // base URL
    let url = "/budgets";

    // array for the query parameters
    const params: string[] = [];

    // Add parameters only if they exist in filterOptions
    if (filterOptions) {
      if (filterOptions.category) {
        params.push(`category=${filterOptions.category}`);
      }
      if (filterOptions.month) {
        params.push(`month=${filterOptions.month}`);
      }
      if (filterOptions.status) {
        params.push(`status=${filterOptions.status}`);
      }
    }

    if (params.length) {
      url += "?" + params.join("&");
    }

    const { data } = await BudgetsApi.get<IBudgetResponse[]>(url);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const findOneBudget = async (budget_id: string) => {
  try {
    const { data } = await BudgetsApi.get<IBudgetResponse>(
      `budgets/${budget_id}`
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const updateBudget = async (
  budget_id: string,
  updateBudget: UpdateBudgetDto
) => {
  try {
    const { data } = await BudgetsApi.patch<IBudgetResponse>(
      `budgets/${budget_id}`,
      updateBudget
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteBudget = async (budget_id: string) => {
  try {
    console.log(budget_id);
    const { data } = await BudgetsApi.delete<{ message: string }>(
      `budgets/${budget_id}`
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
