import { IBudgetResponseWithDates } from "../api-responses/budget.responses.interfaces";
import { ITransactionResponseWithDate } from "../api-responses/transaction.responses.interfaces";

export interface ITransactionList {
  budget: IBudgetResponseWithDates;
  transactions: ITransactionResponseWithDate[];
}
