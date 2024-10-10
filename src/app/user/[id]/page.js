"use client";

import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import UserInfo from "../../../components/UserInfo";
import useUserData from "../../../hooks/useUserData";

export default function UserPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { userData, loading, error } = useUserData(id);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <UserInfo userData={userData} />
      <Button
        type="button"
        onClick={() => router.push(`/recommendation/${id}`)}
      >
        Go to Recommendation
      </Button>
    </div>
  );
}
