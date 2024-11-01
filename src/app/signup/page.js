"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputText from "../../components/InputText"; // Import InputText component
import Button from "@/components/Button"; // Import Button component
import { signIn } from "next-auth/react";

export default function Signup() {
  const router = useRouter();

  // State สำหรับเก็บข้อมูลฟอร์ม
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // State สำหรับ Confirm Password
  const [error, setError] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    // ตรวจสอบว่า Password และ Confirm Password ตรงกัน
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const userData = { email, password };

    try {
      // 1. สร้าง User
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

      // 2. ทำการ Sign in อัตโนมัติ
      const signInResult = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInResult.error) {
        throw new Error("Failed to sign in after signup");
      }

      // 3. Redirect ไปยังหน้า create
      router.push(`/create`);
    } catch (error) {
      setError(error.message);
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-5">Signup</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSignup}>
        <InputText
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputText
          label="Password"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputText
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button type="submit">Sign Up</Button>
      </form>
    </div>
  );
}
