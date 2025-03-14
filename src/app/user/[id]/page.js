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
    <div className="flex flex-col items-center min-h-screen pb-28">
      <div className="p-4 w-full max-w-6xl">
        <h1 className="text-2xl font-bold mb-6 pb-2 border-b-2 border-orange-500">
          ข้อมูลผู้ใช้
        </h1>
        <div className="flex-grow">
          <UserInfo userData={userData} />
        </div>
        <div className="mt-6">
          <Button 
            onClick={() => router.push(`/edit/${id}`)}
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-700 text-white rounded-lg transition-colors duration-200"
          >
            แก้ไขข้อมูล
          </Button>
        </div>
      </div>
    </div>
  );
}
