"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { shadow } from "@/app/styles/utils";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";
import type { User } from "@supabase/supabase-js";
import { SidebarTrigger } from "./ui/sidebar";

type HeaderContentProps = {
  user: User | null;
};

function HeaderContent({ user }: HeaderContentProps) {
  const { resolvedTheme } = useTheme();

  // Use resolvedTheme to handle "system" theme correctly
  const isDark = resolvedTheme === "dark";
  const logoSrc = isDark ? "/dark-logo.png" : "/light-logo.png";

  return (
    <header
      className="bg-background relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <SidebarTrigger className="absolute top-1 left-1" />
      <Link href="/" className="-mt-2 lg:pl-10">
        <Image src={logoSrc} height={150} width={250} alt="logo" priority />
      </Link>
      <div className="flex gap-4 lg:pr-10">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button
              asChild
              className="bg-foreground text-background hidden sm:inline-flex"
            >
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-foreground border-foreground/30"
            >
              <Link href="/login">Log In</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default HeaderContent;
