import { BudgetsApi } from "../config/api/BudgetsApi";
import { ICategoryResponse } from "../common/interfaces/api-responses/categories.responses.interfaces";

export const findAllCategories = async () => {
  try {
    const { data } = await BudgetsApi.get<ICategoryResponse[]>("categories");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
