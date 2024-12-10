import { createBrowserRouter } from "react-router";
import PublicLayout from "../components/share/Layouts/public/PublicLayout";
import { AuthProvider } from "../providers/AuthProvider.provider";
import Home from "../pages/public/Home/HomePage";
import Login from "../pages/public/Auth/Login/LoginPage";
import Register from "../pages/public/Auth/Register/RegisterPage";
import PrivateLayout from "../components/share/Layouts/private/PrivateLayout";
import Budgets from "../pages/private/Budgets/BudgetsPage";
import BudgetDetail from "../pages/private/Budget-Detail/BudgetsDetailPage";

export const Router = createBrowserRouter([
  {
    path: "/",
    Component: () => {
      return (
        <AuthProvider>
          <PublicLayout />
        </AuthProvider>
      );
    },
    children: [
      {
        path: "home",
        Component: Home,
      },
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "app",
    Component: () => {
      return (
        <AuthProvider>
          <PrivateLayout />
        </AuthProvider>
      );
    },
    children: [
      {
        path: "budgets",
        Component: Budgets,
      },
      {
        path: "budget-detail",
        Component: BudgetDetail,
      },
    ],
  },
]);
