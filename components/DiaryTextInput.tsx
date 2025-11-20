"use client";

import { useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { debounceTimeout } from "@/lib/constants";
import { ChangeEvent, useEffect } from "react";
import useDiary from "@/hooks/useDiary";
import { updateDiaryAction } from "@/actions/diaries";

type Props = {
  diaryId: string;
  startingDiaryText: string;
};

let updateTimeout: NodeJS.Timeout;

function DiaryTextInput({ diaryId, startingDiaryText }: Props) {
  const diaryIdParam = useSearchParams().get("diaryId") || "";
  const { diaryText, setDiaryText } = useDiary();

  useEffect(() => {
    if (diaryIdParam === diaryId) {
      setDiaryText(startingDiaryText);
    }
  }, [startingDiaryText, diaryIdParam, diaryId, setDiaryText]);

  const handleUpdateDiary = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setDiaryText(text);

    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      updateDiaryAction(diaryId, { text });
    }, debounceTimeout);
  };

  return (
    <Textarea
      value={diaryText}
      onChange={handleUpdateDiary}
      placeholder="What's on your mind?"
      className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}

export default DiaryTextInput;
