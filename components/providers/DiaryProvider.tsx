"use client";

import { createContext, useState } from "react";

type DiaryProviderContextType = {
  diaryText: string;
  setDiaryText: (diaryText: string) => void;
};

export const DiaryProviderContext = createContext<DiaryProviderContextType>({
  diaryText: "",
  setDiaryText: () => {},
});

function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [diaryText, setDiaryText] = useState("");

  return (
    <DiaryProviderContext.Provider value={{ diaryText, setDiaryText }}>
      {children}
    </DiaryProviderContext.Provider>
  );
}

export default DiaryProvider;
