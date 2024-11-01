"use client";

import { signOut } from "next-auth/react";
import Button from "./Button";

export default async function Header() {
  // const data = await signOut({redirect: false, callbackUrl: "/fo"})

  return (
    <header className="w-full p-4 bg-white shadow-sm">
      <div className="container mx-auto flex justify-end">
        <Button
          onClick={() => signOut({ callbackUrl: `/` })}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
