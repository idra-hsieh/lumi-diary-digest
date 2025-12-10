"use client";

import useDiary from "@/hooks/useDiary";
import { Diary } from "@prisma/client";
import Link from "next/link";
import { SidebarMenuButton } from "./ui/sidebar";
import { BLANK_DIARY_TEXT } from "@/lib/constants";
import { buildDiaryFallbackTitle, cn } from "@/lib/utils";

type Props = {
  diary: Diary;
};

function SelectDiaryButton({ diary }: Props) {
  const {
    diaryText: selectedDiaryText,
    diaryTitle: selectedDiaryTitle,
    selectedDiaryId,
  } = useDiary();
  const isSelected = selectedDiaryId === diary.id;

  const fallbackTitle = buildDiaryFallbackTitle(diary.createdAt, "-");

  const sourceTitle = isSelected ? selectedDiaryTitle : diary.title;
  const normalizedTitle = sourceTitle?.trim() ?? "";
  const displayTitle = normalizedTitle || fallbackTitle;
  const isFallbackTitle = normalizedTitle.length === 0;

  const sourceText = isSelected ? selectedDiaryText : diary.text;
  const normalizedText = sourceText?.trim() ?? "";
  const displayText = normalizedText || BLANK_DIARY_TEXT;
  const isFallbackText = normalizedText.length === 0;
  const formattedCreatedAt = new Date(diary.createdAt).toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
  const formattedUpdatedAt = new Date(diary.updatedAt).toLocaleString(
    undefined,
    {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <SidebarMenuButton
      asChild
      className={cn(
        "items-start gap-1 pr-12",
        isSelected && "bg-sidebar-accent/30",
      )}
    >
      <Link href={`/?diaryId=${diary.id}`} className="flex h-fit flex-col">
        <p
          className={cn(
            "text-foreground w-full truncate overflow-hidden text-sm font-semibold whitespace-nowrap",
            isFallbackTitle && "opacity-60",
          )}
        >
          {displayTitle}
        </p>
        <p
          className={cn(
            "text-foreground/80 line-clamp-2 w-full overflow-hidden text-[12px]",
            isFallbackText && "opacity-60",
          )}
        >
          {displayText}
        </p>
        <p className="text-muted-foreground/60 text-[10px]">
          Created: {formattedCreatedAt}
        </p>
        <p className="text-muted-foreground/60 text-[10px]">
          Last updated: {formattedUpdatedAt}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectDiaryButton;
