import { User } from "../entities/user.entity.interfaces";

export interface ILoginResponse {
  accessToken: string;
  user: User;
}
