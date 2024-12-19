export interface ITransactionResponse {
  id: string;
  budget_id: string;
  amount: number;
  date: string;
  description: string | null;
}

export interface ITransactionResponseWithDate
  extends Omit<ITransactionResponse, "date"> {
  date: Date;
}
