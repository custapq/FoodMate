"use client";

import { useRouter } from "next/navigation";
import Button from "../../../components/Button";

export default function RecommendationPage({ params }) {
  const { id } = params;
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Button type="button" onClick={() => router.push(`/user/${id}`)}>
        Go to User Page
      </Button>
    </div>
  );
}
