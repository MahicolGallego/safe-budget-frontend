import { IBudgetList } from "../../common/interfaces/for-components/budget-list.interface";
import { BudgetCard } from "./budget-card";

export const BudgetList = ({
  budgets,
  categories,
  monthListForSelect,
  budgetUpdateFunction,
  budgetDeleteFunction,
}: IBudgetList) => {
  return (
    <>
      {...budgets.map((budget) => (
        <BudgetCard
          budget={budget}
          categories={categories}
          monthListForSelect={monthListForSelect}
          budgetUpdateFunction={budgetUpdateFunction}
          budgetDeleteFunction={budgetDeleteFunction}
        />
      ))}
    </>
  );
};
