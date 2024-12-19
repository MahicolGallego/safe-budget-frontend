import { ITransactionResponseWithDate } from "../api-responses/transaction.responses.interfaces";
import { ITransactionList } from "./transaction-list.interface";

export interface ITransactionCard
  extends Omit<ITransactionList, "transactions"> {
  transaction: ITransactionResponseWithDate;
}
