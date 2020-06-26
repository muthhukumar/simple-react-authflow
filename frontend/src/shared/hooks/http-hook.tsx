import { useState, useRef, useEffect, useCallback } from "react";
import Axios from "axios";

import axios from "../../util/axios";

export const useHttpClient = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const source = useRef<any>();
  const mounted = useRef(true);

  const httpClient = useCallback(
    async (
      data: any,
      url: string,
      method: "post" | "get" | "patch" | "delete",
      token: string | null
    ) => {
      source.current = Axios.CancelToken.source();

      let response;
      if (mounted.current) setIsLoading(true);
      let headers;
      if (token) {
        headers = {
          Authorization: "Bearer " + token,
        };
      }

      try {
        response = await axios({
          url,
          method,
          data,
          headers,
          cancelToken: source.current.token,
        });

        if (mounted.current) {
          setIsLoading(false);
          return response;
        }

        throw new Error("Something went wrong");
      } catch (err) {
        if (mounted.current) {
          setError(err.response.data.message);
          setIsLoading(false);
        }
        throw new Error(err.response.data.message);
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      mounted.current = false;
      if (source.current) source.current.cancel();
    };
  }, []);

  const resetError = () => {
    setError(null);
  };

  const resetLoading = () => {
    setIsLoading(false);
  };

  return [error, resetError, isLoading, resetLoading, httpClient] as const;
};
