"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputText from "../../components/InputText";
import Button from "@/components/Button"; 
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function Signup() {
  const router = useRouter();

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userData = { email, password };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      const userId = data.user.id;
      localStorage.setItem("userId", userId);

      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult.error) {
        throw new Error("Failed to sign in after signup");
      }

      router.push(`/create`);
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">สมัครสมาชิก</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSignup}>
        <InputText
          label="อีเมล"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputText
          label="รหัสผ่าน"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputText
          label="ยืนยันรหัสผ่าน"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          สมัครสมาชิก
        </Button>
      </form>
      <div className="mt-4 text-center">
        <p>
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/signin" className="text-blue-600 hover:text-blue-800">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
