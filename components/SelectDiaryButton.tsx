"use client";

import useDiary from "@/hooks/useDiary";
import { Diary } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuButton } from "./ui/sidebar";

type Props = {
  diary: Diary;
};

function SelectDiaryButton({ diary }: Props) {
  const diaryId = useSearchParams().get("diaryId") || "";

  const { diaryText: selectedDiaryText } = useDiary();
  const [shouldUseGlobalDiaryText, setShouldUseGlobalDiaryText] =
    useState(false);
  const [localDiaryText, setlocalDiaryText] = useState(diary.text);

  useEffect(() => {
    if (diaryId === diary.id) {
      setShouldUseGlobalDiaryText(true);
    } else {
      setShouldUseGlobalDiaryText(false);
    }
  }, [diaryId, diary.id]);

  useEffect(() => {
    if (shouldUseGlobalDiaryText) {
      setlocalDiaryText(selectedDiaryText);
    }
  }, [selectedDiaryText, shouldUseGlobalDiaryText]);

  const blankDiaryText = "EMPTY DIARY";
  let diaryText = localDiaryText || blankDiaryText;
  if (shouldUseGlobalDiaryText) {
    diaryText = selectedDiaryText || blankDiaryText;
  }

  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${diary.id === diaryId && "bg-sidebar-accent/30"}`}
    >
      <Link href={`/?diaryId=${diary.id}`} className="flex h-fit flex-col">
        <p className="text-foreground w-full truncate overflow-hidden whitespace-nowrap">
          {diary.title}
        </p>
        <p className="text-foreground w-full truncate overflow-hidden whitespace-nowrap">
          {diaryText}
        </p>
        <p className="text-muted-foreground text-xs">
          {diary.createdAt.toLocaleDateString()}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectDiaryButton;
