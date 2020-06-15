import { useState, useRef, useEffect } from "react";

import axios from "../../util/axios";

export const useHttpClient = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const activeHttpRequest = useRef<AbortController[]>([]);

  const httpClient = async (
    data: any,
    method: "post" | "get" | "patch" | "delete",
    token: string | null
  ) => {
    let response;
    setIsLoading(true);
    const abortSignal = new AbortController();
    activeHttpRequest.current.push(abortSignal);
    let headers;
    if (token) {
      headers = {
        Authorization: "Bearer " + token,
      };
    }

    try {
      response = await axios({ method, data, headers });
      activeHttpRequest.current = activeHttpRequest.current.filter(
        (ctrl) => ctrl !== abortSignal
      );
      setIsLoading(false);
      return response;
    } catch (err) {
      setError("Something went wrong");
      setIsLoading(false);
      throw new Error("Something went wrong");
    }
  };
  useEffect(() => {
    return () => activeHttpRequest.current.forEach((ctrl) => ctrl.abort());
  }, []);

  const resetError = () => {
    setError(null);
  };

  const resetLoading = () => {
    setIsLoading(false);
  };

  return [error, resetError, isLoading, resetLoading, httpClient] as const;
};
