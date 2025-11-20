import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  if (error instanceof Error) {
    return { errorMessage: error.message };
  } else {
    return { errorMessage: "An error occurred" };
  }
};

export const formatDiaryTitleFromDate = (
  input?: Date | string | null,
  separator = "/",
): string => {
  if (!input) return "";

  const date = typeof input === "string" ? new Date(input) : input;
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${separator}${month}${separator}${day}`;
};

export const buildDiaryFallbackTitle = (
  input?: Date | string | null,
  separator = "-",
) => {
  const createdLabel = formatDiaryTitleFromDate(input, separator);
  return createdLabel ? `UNTITLED (${createdLabel})` : "UNTITLED";
};
