import React from "react";
import { IBudgetResponse } from "../../../constants/interfaces/api-responses/budget.responses.interfaces";

export const BudgetList = ({ budgets }: { budgets: IBudgetResponse[] }) => {
  return <div> {!budgets.length ? true : "No budgets"}</div>;
};
