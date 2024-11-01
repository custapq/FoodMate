"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputText from "@/components/InputText";
import Button from "@/components/Button";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result.error) {
        console.error("error: ", result.error);
      } else {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        if (session?.user?.id) {
          router.push(`/recommendation/${session.user.id}`);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      {" "}
      {/* Centering the form */}
      <h2 className="text-2xl font-bold mb-5">เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit} className="w-full">
        <InputText
          label="อีเมล"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputText
          label="รหัสผ่าน"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          เข้าสู่ระบบ
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p>
          ยังไม่มีบัญชี?{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-800">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </div>
  );
}
