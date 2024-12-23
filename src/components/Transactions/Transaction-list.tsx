import { ITransactionList } from "../../common/interfaces/for-components/transaction-list.interface";
import { TransactionCard } from "./transaction-card";

export const TransactionList = ({
  budget,
  transactions,
  transactionUpdateFunction,
  transactionDeleteFunction,
}: ITransactionList) => {
  return (
    <>
      {...transactions.map((transaction) => (
        <TransactionCard
          budget={budget}
          transaction={transaction}
          transactionUpdateFunction={transactionUpdateFunction}
          transactionDeleteFunction={transactionDeleteFunction}
        />
      ))}
    </>
  );
};
