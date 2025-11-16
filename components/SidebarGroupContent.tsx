"use client";

import { Diary } from "@/types/prisma";

type Props = {
  diaries: Diary[];
};

function SidebarGroupContent({ diaries }: Props) {
  console.log(diaries);
  return <div>Your diaries here</div>;
}

export default SidebarGroupContent;
