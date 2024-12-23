import { FormInstance } from "antd";
import { UpdateTransactionDto } from "../api-requests-dtos/update-transaction.dto";
import { IBudgetResponseWithDates } from "../api-responses/budget.responses.interfaces";
import {
  ITransactionResponse,
  ITransactionResponseWithDate,
} from "../api-responses/transaction.responses.interfaces";

export interface ITransactionList {
  budget: IBudgetResponseWithDates;
  transactions: ITransactionResponseWithDate[];
  transactionUpdateFunction: (
    transactionToUpdate: ITransactionResponseWithDate,
    updateTransactionDto: UpdateTransactionDto,
    form: FormInstance,
    handleRequestUpdateTransaction: (
      request: () => Promise<ITransactionResponse | null>
    ) => Promise<ITransactionResponse | null>
  ) => Promise<void>;
  transactionDeleteFunction: (transaction_id: string) => void;
}
