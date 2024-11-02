import { useState, useEffect, useCallback } from "react";

const useFavorites = (userId) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite/${userId}`
      );
      if (!res.ok) throw new Error("Failed to fetch favorites");
      const data = await res.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const toggleFavorite = async (foodId) => {
    try {
      const isFavorite = favorites.some((fav) => fav.foodId === foodId);
      const method = isFavorite ? "DELETE" : "POST";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorite`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, foodId }),
        }
      );

      if (!res.ok) throw new Error("Failed to update favorite");
      // Update local state instead of fetching
      if (isFavorite) {
        setFavorites((prev) => prev.filter((fav) => fav.foodId !== foodId));
      } else {
        setFavorites((prev) => [...prev, { userId, foodId }]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId, fetchFavorites]);

  return { favorites, loading, error, toggleFavorite };
};

export default useFavorites;
