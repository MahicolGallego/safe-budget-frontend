import { create } from "zustand";
import { LocalStorage } from "../adapters/local-storage/LocalStorage";
import { authLogin, authRegister } from "../actions/auth.actions";
import { User } from "../constants/interfaces/entities/user.interfaces";

interface AuthState {
  is_authenticated: boolean | null;
  token?: string;
  user?: User;

  register: (name: string, email: string, password: string) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkStatus: () => boolean;
}

// crear e incializar un estado global del tipo especificado en memoria -> se puede leer desde todos los componentes
export const useAuthStore = create<AuthState>()((set) => ({
  //set -> es la funcion que permite realizar la creacion/actualizacion del nuevo estado
  is_authenticated: null,
  token: undefined,
  user: undefined,

  checkStatus: (): boolean => {
    const token = LocalStorage.getItem("token");
    const userString = LocalStorage.getItem("user");

    if (token && userString) {
      const user = JSON.parse(userString);
      set({ is_authenticated: true, token, user });
      return true;
    }

    set({ is_authenticated: false, token: undefined, user: undefined });
    return false;
  },
  register: async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    const response = await authRegister(name, email, password);
    if (!response) {
      return false;
    }

    set({
      is_authenticated: true,
      token: response.token,
      user: response.user,
    });

    LocalStorage.setItem("token", response.token);
    LocalStorage.setItem("user", JSON.stringify(response.user));

    return true;
  },

  login: async (email: string, password: string): Promise<boolean> => {
    const response = await authLogin(email, password);
    if (!response) {
      return false;
    }

    set({
      is_authenticated: true,
      token: response.token,
      user: response.user,
    });

    LocalStorage.setItem("token", response.token);
    LocalStorage.setItem("user", JSON.stringify(response.user));

    return true;
  },
  logout: async () => {
    LocalStorage.removeItem("token");
    LocalStorage.removeItem("user");
    set({
      is_authenticated: false,
      token: undefined,
      user: undefined,
    });
  },
}));