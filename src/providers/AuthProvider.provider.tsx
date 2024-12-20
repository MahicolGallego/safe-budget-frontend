import { PropsWithChildren, useEffect, useState } from "react";
import { useAuthStore } from "../store/auth.store";
import { LoadingSpinner } from "../components/share/loading";
import { useLocation, useNavigate } from "react-router";

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const { is_authenticated, checkStatus } = useAuthStore();
  const [verifyingAuth, setVerifyingAuth] = useState(true);
  const location = useLocation(); // Gets the current location (current path)

  useEffect(() => {
    checkStatus();
    //Delay to avoid the small flash of prohibited content while
    //redirecting if applicable
    setTimeout(() => {
      setVerifyingAuth(false);
    }, 300);
  }, []);

  useEffect(() => {
    if (is_authenticated === false) {
      console.log("redirect from no authenticated");
      if (location.pathname.startsWith("/app")) {
        navigate("/login", { replace: true });
      }
    } else if (is_authenticated) {
      console.log("redirect from authenticated");
      if (
        ["/", "/app", "/app/", "/home", "/register", "/login"].includes(
          location.pathname
        )
      ) {
        navigate("/app/budgets", { replace: true });
      }
    }
  }, [is_authenticated, location, navigate]);

  if (verifyingAuth) return <LoadingSpinner />;

  return <>{children}</>;
};
