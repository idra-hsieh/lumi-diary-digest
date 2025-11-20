"use client";

import { createContext, useState } from "react";

type DiaryProviderContextType = {
  diaryText: string;
  setDiaryText: (diaryText: string) => void;
  diaryTitle: string;
  setDiaryTitle: (diaryTitle: string) => void;
};

export const DiaryProviderContext = createContext<DiaryProviderContextType>({
  diaryText: "",
  setDiaryText: () => {},
  diaryTitle: "",
  setDiaryTitle: () => {},
});

function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [diaryText, setDiaryText] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");

  return (
    <DiaryProviderContext.Provider
      value={{ diaryText, setDiaryText, diaryTitle, setDiaryTitle }}
    >
      {children}
    </DiaryProviderContext.Provider>
  );
}

export default DiaryProvider;
