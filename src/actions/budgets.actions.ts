import { BudgetsApi } from "../config/api/BudgetsApi";
import { CreateBudgetDto } from "../constants/interfaces/api-requests-dtos/create-budgets.dto";
import { FilterBudgetDto } from "../constants/interfaces/api-requests-dtos/filter-budget.dto";
import { IBudgetResponse } from "../constants/interfaces/api-responses/budget.responses.interfaces";

export const createBudget = async (
  createBudgetDto: CreateBudgetDto
): Promise<IBudgetResponse | null> => {
  try {
    const { data } = await BudgetsApi.post<IBudgetResponse>("auth/register", {
      createBudgetDto,
    });
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
    if (filterOptions.category) {
      params.push(`category=${filterOptions.category}`);
    }
    if (filterOptions.month) {
      params.push(`month=${filterOptions.month}`);
    }
    if (filterOptions.status) {
      params.push(`status=${filterOptions.status}`);
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