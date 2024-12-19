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
