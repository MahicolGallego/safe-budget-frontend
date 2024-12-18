import { BudgetsApi } from "../config/api/BudgetsApi";
import { User } from "../common/interfaces/entities/user.entity.interfaces";

export const onboardingViewed = async () => {
  try {
    const { data } = await BudgetsApi.patch<User>("users/onboarding-viewed");
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
