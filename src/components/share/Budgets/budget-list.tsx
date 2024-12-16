import { IBudgetList } from "../../../constants/interfaces/for-components/budget-list.interface";
import { BudgetCard } from "./budget-card";

export const BudgetList = ({
  budgets,
  updateFunction,
  deleteFunction,
}: IBudgetList) => {
  return (
    <>
      {...budgets.map((budget) => (
        <BudgetCard
          budget={budget}
          updateFunction={updateFunction}
          deleteFunction={deleteFunction}
        />
      ))}
    </>
  );
};
