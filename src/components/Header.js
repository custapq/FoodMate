"use client";

import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <header className="w-full py-4 bg-white border-b mb-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h1 className="text-xl font-medium">FoodMate</h1>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-gray-600 hover:text-gray-800 text-sm transition-colors duration-200"
        >
          ออกจากระบบ
        </button>
      </div>
    </header>
  );
}
