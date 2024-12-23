import { CreateTransactionDto } from "./create-transaction.dto";

export interface UpdateTransactionDto
  extends Omit<Partial<CreateTransactionDto>, "budget_id"> {
  budget_id: string;
}
