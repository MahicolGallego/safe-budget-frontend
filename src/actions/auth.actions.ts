import { BudgetsApi } from "../config/api/BudgetsApi";
import { ILoginResponse } from "../constants/interfaces/api-responses/auth-responses.interfaces";

export const authRegister = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const { data } = await BudgetsApi.post<ILoginResponse>("auth/register", {
      name,
      email,
      password,
    });

    const { user, accessToken } = data;
    return { user, token: accessToken };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const authLogin = async (email: string, password: string) => {
  try {
    const { data } = await BudgetsApi.post<ILoginResponse>("auth/login", {
      email,
      password,
    });

    const { user, accessToken } = data;
    return { user, token: accessToken };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const authVerifyToken = async (
  token: string
): Promise<{ token_is_valid: boolean }> => {
  try {
    const { data } = await BudgetsApi.post<{ token_is_valid: boolean }>(
      "auth/verify",
      { token }
    );
    return data;
  } catch (error) {
    console.error(error);
    return { token_is_valid: false };
  }
};
