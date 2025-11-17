"use client";

import { DiaryProviderContext } from "@/components/providers/DiaryProvider";
import { useContext } from "react";

function useDiary() {
  const context = useContext(DiaryProviderContext);

  if (!context) throw new Error("useDiary must be used within a DiaryProvider");

  return context;
}

export default useDiary;
