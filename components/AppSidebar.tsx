import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { getUser } from "@/utils/supabase/server";
import { prisma } from "@/db/prisma";
import Link from "next/link";
import { Diary } from "@/types/prisma";
import SidebarGroupContent from "./SidebarGroupContent";

async function AppSidebar() {
  const user = await getUser();
  let diaries: Diary[] = [];

  if (user) {
    diaries = await prisma.diary.findMany({
      where: {
        authorId: user.id,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="text-md text-foreground mt-2 mb-2">
            {user ? (
              "Your Diaries"
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Log in
                </Link>{" "}
                to see your diaries.
              </p>
            )}
          </SidebarGroupLabel>
          {user && <SidebarGroupContent diaries={diaries} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
