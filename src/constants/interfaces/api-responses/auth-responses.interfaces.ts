import { User } from "../entities/user.interfaces";

export interface ILoginResponse {
  accessToken: string;
  user: User;
}
