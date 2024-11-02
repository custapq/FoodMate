"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useFavorites from "@/hooks/useFavorites";
import FoodCard from "@/components/FoodCard";
import LoadingScreen from "@/components/LoadingScreen";

export default function FavoritePage({ params }) {
  const { id } = params;
  const router = useRouter();
  const { data: session, status } = useSession();
  const { favorites, loading, error } = useFavorites(parseInt(id));

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
          อาหารที่ชื่นชอบ
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {favorites.map((favorite) => (
            <FoodCard
              key={favorite.foodId}
              food={favorite.food}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
        {favorites.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            ยังไม่มีอาหารที่ชื่นชอบ
          </p>
        )}
      </div>
    </div>
  );
}
