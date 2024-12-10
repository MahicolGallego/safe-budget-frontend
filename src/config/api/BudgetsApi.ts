import axios from "axios";
import { LocalStorage } from "../../adapters/local-storage/LocalStorage";

const BudgetsApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//interceptors
BudgetsApi.interceptors.request.use((config) => {
  // Add token to header if exist in storage for the request
  const token = LocalStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { BudgetsApi };
