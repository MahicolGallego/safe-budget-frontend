import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";

export const useLogin = () => {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const [hiddenBadResults, setHiddenBadResults] = useState<boolean>(true);

  const { login } = useAuthStore();

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setIsRequesting(true);
    const success = await login(email, password);
    setIsRequesting(false);

    if (!success) {
      setHiddenBadResults(false);
      return;
    }
    setHiddenBadResults(true);
  };

  return {
    // Properties
    isRequesting,
    hiddenBadResults,
    // Methods
    handleLogin,
  };
};
