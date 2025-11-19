"use client";

import { Diary } from "@/types/prisma";
import { SidebarContent as SidebarGroupContentShadCN } from "./ui/sidebar";
import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

type Props = {
  diaries: Diary[];
};

function SidebarGroupContent({ diaries }: Props) {
  const [searchText, setSearchText] = useState("");
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
    </SidebarGroupContentShadCN>
  );
}

export default SidebarGroupContent;
