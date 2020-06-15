import { useState } from "react";

export const useInput = (initialValue?: string, validators?: any) => {
  const [input, setInputValue] = useState<string>(initialValue || "");

  const setValue = (value: string) => {
    setInputValue(value);
  };
  return [input, setValue] as const;
};
