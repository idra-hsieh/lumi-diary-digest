"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Textarea } from "./ui/textarea";
import { debounceTimeout } from "@/lib/constants";
import { ChangeEvent, useEffect } from "react";
import useDiary from "@/hooks/useDiary";
import { updateDiaryAction } from "@/actions/diaries";

type Props = {
  diaryId: string;
  startingDiaryText: string;
  isLoggedIn: boolean;
};

let updateTimeout: NodeJS.Timeout;

function DiaryTextInput({ diaryId, startingDiaryText, isLoggedIn }: Props) {
  const router = useRouter();
  const diaryIdParam = useSearchParams().get("diaryId") || "";
  const { diaryText, setDiaryText } = useDiary();

  useEffect(() => {
    if (diaryIdParam === diaryId) {
      setDiaryText(startingDiaryText);
    }
  }, [startingDiaryText, diaryIdParam, diaryId, setDiaryText]);

  const handleUpdateDiary = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (!diaryId) return;

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
      onFocus={() => {
        if (!isLoggedIn) router.push("/login");
      }}
      placeholder="What's on your mind?"
      readOnly={!isLoggedIn || !diaryId}
      className="custom-scrollbar placeholder:text-muted-foreground/80 mb-4 h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}

export default DiaryTextInput;
