"use client";

import useDiary from "@/hooks/useDiary";
import { Diary } from "@prisma/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SidebarMenuButton } from "./ui/sidebar";
import { BLANK_DIARY_TEXT } from "@/lib/constants";
import { buildDiaryFallbackTitle, cn } from "@/lib/utils";

type Props = {
  diary: Diary;
};

function SelectDiaryButton({ diary }: Props) {
  const diaryId = useSearchParams().get("diaryId") || "";

  const { diaryText: selectedDiaryText, diaryTitle: selectedDiaryTitle } =
    useDiary();
  const isSelected = diaryId === diary.id;

  const fallbackTitle = buildDiaryFallbackTitle(diary.createdAt, "-");

  const sourceTitle = isSelected ? selectedDiaryTitle : diary.title;
  const normalizedTitle = sourceTitle?.trim() ?? "";
  const displayTitle = normalizedTitle || fallbackTitle;
  const isFallbackTitle = normalizedTitle.length === 0;

  const sourceText = isSelected ? selectedDiaryText : diary.text;
  const normalizedText = sourceText?.trim() ?? "";
  const displayText = normalizedText || BLANK_DIARY_TEXT;
  const isFallbackText = normalizedText.length === 0;
  const formattedUpdatedAt = new Date(diary.updatedAt).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <SidebarMenuButton
      asChild
      className={cn(
        "items-start gap-0 pr-12",
        isSelected && "bg-sidebar-accent/30",
      )}
    >
      <Link href={`/?diaryId=${diary.id}`} className="flex h-fit flex-col">
        <p
          className={cn(
            "text-foreground w-full truncate overflow-hidden text-sm font-semibold whitespace-nowrap",
            isFallbackTitle && "opacity-70",
          )}
        >
          {displayTitle}
        </p>
        <p
          className={cn(
            "text-foreground w-full truncate overflow-hidden text-xs whitespace-nowrap",
            isFallbackText && "opacity-70",
          )}
        >
          {displayText}
        </p>
        <p className="text-muted-foreground text-xs">
          Last updated: {formattedUpdatedAt}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectDiaryButton;
