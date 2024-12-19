import { CreateTransactionDto } from "../common/interfaces/api-requests-dtos/create-transaction.dto";
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
  budget_id: string
): Promise<ITransactionResponse[] | null> => {
  try {
    // base URL
    const url = `/transactions/budget/${budget_id}`;

    const { data } = await BudgetsApi.get<ITransactionResponse[]>(url);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
