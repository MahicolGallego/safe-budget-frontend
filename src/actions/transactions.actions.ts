import { CreateTransactionDto } from "../common/interfaces/api-requests-dtos/create-transaction.dto";
import { FilterTransactionDto } from "../common/interfaces/api-requests-dtos/filter-transaction.dto";
import { ITransactionResponse } from "../common/interfaces/api-responses/transaction.responses.interfaces";
import { BudgetsApi } from "../config/api/BudgetsApi";

export const createTransaction = async (
  createTransactionDto: CreateTransactionDto
): Promise<ITransactionResponse | null> => {
  try {
    const { data } = await BudgetsApi.post<ITransactionResponse>(
      "/transactions",
      createTransactionDto
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const findAllTransactions = async (
  budget_id: string,
  filterOptions: FilterTransactionDto
): Promise<ITransactionResponse[] | null> => {
  try {
    // base URL
    let url = `/transactions/budget/${budget_id}`;

    const { min_day, max_day, min_amount, max_amount } = filterOptions;
    // array for the query parameters
    const params: string[] = [];

    // reject if parameters are not consistent
    if (
      (min_day && max_day && min_day > max_day) ||
      (min_amount && max_amount && min_amount > max_amount)
    ) {
      return null;
    }

    if (min_day) {
      params.push(`min_day=${min_day}`);
    }
    if (max_day) {
      params.push(`max_day=${max_day}`);
    }
    if (min_amount) {
      params.push(`min_amount=${min_amount}`);
    }
    if (max_amount) {
      params.push(`max_amount=${max_amount}`);
    }

    if (params.length) {
      url += "?" + params.join("&");
    }

    const { data } = await BudgetsApi.get<ITransactionResponse[]>(url);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const deleteTransaction = async (
  transaction_id: string,
  budget_id: string
) => {
  try {
    const { data } = await BudgetsApi.delete<{ message: string }>(
      `transactions/${transaction_id}/budget/${budget_id}`
    );
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
