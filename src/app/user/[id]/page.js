"use client";

import { useRouter } from "next/navigation";
import Button from "../../../components/Button";
import UserInfo from "../../../components/UserInfo";
import useUserData from "../../../hooks/useUserData";

export default function UserPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { userData, loading, error } = useUserData(id);

  console.log(userData);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center ">
      <div className="flex-grow">
        <UserInfo userData={userData} />
      </div>
      <div className="w-full sticky bottom-0 p-4 bg-white" id="button-div">
        <Button
          type="button"
          onClick={() => router.push(`/recommendation/${id}`)}
          className="w-full"
        >
          Go to Recommendation
        </Button>
      </div>
      <style jsx>{`
          @media (min-width: 769px) {
            #button-div {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          }
        }
      `}</style>
    </div>
  );
}
