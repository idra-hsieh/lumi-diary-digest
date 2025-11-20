"use client";

import { Diary } from "@/types/prisma";
import {
  SidebarContent as SidebarGroupContentShadCN,
  SidebarMenu,
  SidebarMenuItem,
} from "./ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import SelectDiaryButton from "./SelectDiaryButton";
import DeleteDiaryButton from "./DeleteDiaryButton";

type Props = {
  diaries: Diary[];
};

function SidebarGroupContent({ diaries }: Props) {
  const [searchText, setSearchText] = useState("");
  const [localDiaries, setLocalDiaries] = useState(diaries);

  useEffect(() => {
    setLocalDiaries(diaries);
  }, [diaries]);

  const fuse = useMemo(() => {
    return new Fuse(localDiaries, {
      keys: ["title", "text"],
      threshold: 0.4, // moderately fuzzy
    });
  }, [localDiaries]);

  const filteredDiaries = searchText
    ? fuse.search(searchText).map((result) => result.item)
    : localDiaries;

  const deleteDiaryLocally = (diaryId: string) => {
    setLocalDiaries((prevDiaries) =>
      prevDiaries.filter((diary) => diary.id !== diaryId),
    );
  };

  return (
    <SidebarGroupContentShadCN>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-2 size-4" />
        <Input
          className="bg-muted pl-8"
          placeholder="Search your diary..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <SidebarMenu className="mt-4">
        {filteredDiaries.map((diary) => (
          <SidebarMenuItem key={diary.id} className="group/item">
            <SelectDiaryButton diary={diary} />
            <DeleteDiaryButton
              diaryId={diary.id}
              deleteDiaryLocally={deleteDiaryLocally}
            />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
