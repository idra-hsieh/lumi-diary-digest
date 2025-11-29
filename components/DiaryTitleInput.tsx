"use client";

import { useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { ChangeEvent, useEffect, useRef } from "react";
import { debounceTimeout } from "@/lib/constants";
import useDiary from "@/hooks/useDiary";
import { updateDiaryAction } from "@/actions/diaries";

type Props = {
  diaryId: string;
  startingDiaryTitle: string;
};

function DiaryTitleInput({ diaryId, startingDiaryTitle }: Props) {
  const diaryIdParam = useSearchParams().get("diaryId") || "";
  const { diaryTitle, setDiaryTitle } = useDiary();

  // useRef prevents the global timeout pollution
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const normalizedStartingTitle = startingDiaryTitle?.trim() ?? "";

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /**
   * Sync when a new diary is selected.
   * This runs ONLY when:
   * - user clicks a new diary in sidebar
   * - searchParams update
   * - starting title comes from server
   */
  useEffect(() => {
    if (!diaryId || diaryIdParam !== diaryId) return;
    setDiaryTitle(normalizedStartingTitle);
  }, [diaryIdParam, diaryId, normalizedStartingTitle, setDiaryTitle]);

  useEffect(() => {
    if (!diaryId) {
      setDiaryTitle("");
    }
  }, [diaryId, setDiaryTitle]);

  /** Handle user typing */
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!diaryId) return;

    const title = e.target.value;

    setDiaryTitle(title);

    // Clear old debounce
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    // Debounce update
    timeoutRef.current = setTimeout(() => {
      updateDiaryAction(diaryId, { title });
    }, debounceTimeout);
  };

  return (
    <div className="w-full max-w-4xl">
      <Input
        value={diaryTitle}
        onChange={handleTitleChange}
        placeholder="  Add a title..."
        className="custom-scrollbar placeholder:text-muted-foreground/80 text-foreground mb-2 w-full border p-2 text-lg font-medium tracking-wide focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}

export default DiaryTitleInput;
