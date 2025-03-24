import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Home } from "lucide-react";
import { Button } from "./ui/button";

export default async function Header() {
  const user = await currentUser();

  return (
    <header className="flex justify-end items-center p-4 gap-4 h-16">
      <Link href="/" className="mr-auto">
        <Button variant="ghost" size="icon">
          <Home className="w-5 h-5" />
        </Button>
      </Link>
      {user ? (
        <UserButton />
      ) : (
        <>
          <Link href="/sign-in">Sign In</Link>
          <Link href="/sign-up">Sign Up</Link>
        </>
      )}
    </header>
  );
}
