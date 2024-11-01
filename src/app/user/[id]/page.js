"use client";

import { useRouter } from "next/navigation";
import UserInfo from "@/components/UserInfo";
import useUserData from "@/hooks/useUserData";
import Button from "@/components/Button";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function UserPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { userData, loading, error } = useUserData(id);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    } else if (session?.user?.id !== parseInt(id)) {
      router.push("/");
    }
  }, [session, status, id, router]);

  if (loading || status !== "authenticated") {
    return <LoadingScreen />;
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex-grow">
        <UserInfo userData={userData} />
      </div>
      <Button onClick={() => router.push(`/edit/${id}`)}>แก้ไขข้อมูล</Button>
    </div>
  );
}
