import { useState } from "react";
import { useAuthStore } from "../../store/auth.store";

export const useRegister = () => {
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const [hiddenBadResults, setHiddenBadResults] = useState<boolean>(true);

  const { register } = useAuthStore();

  const handleRegister = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    setIsRequesting(true);
    const success = await register(name, email, password);
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
    handleRegister,
  };
};
