"use client";

import { createContext, useState } from "react";

type DiaryProviderContextType = {
  diaryText: string;
  setDiaryText: (diaryText: string) => void;
  diaryTitle: string;
  setDiaryTitle: (diaryTitle: string) => void;
  selectedDiaryId: string;
  setSelectedDiaryId: (diaryId: string) => void;
};

export const DiaryProviderContext = createContext<DiaryProviderContextType>({
  diaryText: "",
  setDiaryText: () => {},
  diaryTitle: "",
  setDiaryTitle: () => {},
  selectedDiaryId: "",
  setSelectedDiaryId: () => {},
});

function DiaryProvider({ children }: { children: React.ReactNode }) {
  const [diaryText, setDiaryText] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");
  const [selectedDiaryId, setSelectedDiaryId] = useState("");

  return (
    <DiaryProviderContext.Provider
      value={{
        diaryText,
        setDiaryText,
        diaryTitle,
        setDiaryTitle,
        selectedDiaryId,
        setSelectedDiaryId,
      }}
    >
      {children}
    </DiaryProviderContext.Provider>
  );
}

export default DiaryProvider;
