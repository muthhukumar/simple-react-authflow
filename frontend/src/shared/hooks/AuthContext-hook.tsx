import { createContext, useState } from "react";

export const AuthContext = createContext({
  accesstoken: "",
  login: (accesstoken: string) => {},
  logout: () => {},
  error: "",
  setErrorMessage: (message: string) => {},
});

export const useAuthContext = () => {
  const [accesstoken, setAccesstoken] = useState<string>("");
  const [error, setError] = useState<string>("");

  const login = (accesstoken: string) => {
    setAccesstoken(accesstoken);
  };

  const setErrorMessage = (message: string) => {
    setError(message);
  };

  const logout = () => {
    setAccesstoken("");
  };

  return [accesstoken, login, logout, error, setErrorMessage] as const;
};
