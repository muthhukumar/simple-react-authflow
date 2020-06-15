import { useEffect, useState } from "react";

export const useErrorModal = () => {
  const [message, setErrorMessage] = useState<string>("");
  const [isErrorModalOpen, setErrorModal] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (message) {
      timer = setTimeout(() => {
        setErrorModal(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [setErrorModal, message]);

  const setMessage = (message: string) => {
    setErrorMessage(message);
  };

  const setIsErrorModalOpen = (value: boolean) => {
    setErrorModal(value);
  };

  return [message, setMessage, isErrorModalOpen, setIsErrorModalOpen] as const;
};
