import Link from "next/link";
import Image from "next/image";
import { shadow } from "@/app/styles/utils";
import { Button } from "./ui/button";
import DarkModeToggle from "./DarkModeToggle";
import LogOutButton from "./LogOutButton";

function Header() {
  const user = { name: "Idra" };
  return (
    <header
      className="bg-background relative flex h-24 w-full items-center justify-between px-3 sm:px-8"
      style={{
        boxShadow: shadow,
      }}
    >
      <Link href="/" className="-mt-2">
        <Image
          src="/light-logo-wordmark.png"
          height={150}
          width={250}
          alt="logo"
          // className="rounded-full"
          priority
        />
      </Link>
      <div className="flex gap-4">
        {user ? (
          <LogOutButton />
        ) : (
          <>
            <Button asChild>
              <Link href="/signup" className="sm:bg-foreground hidden sm:block">
                Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/login">Log In</Link>
            </Button>
          </>
        )}
        <DarkModeToggle />
      </div>
    </header>
  );
}

export default Header;
