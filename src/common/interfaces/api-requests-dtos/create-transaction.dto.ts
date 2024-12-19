export interface CreateTransactionDto {
  budget_id: string;
  amount: number;
  date: Date;
  description?: string;
}
