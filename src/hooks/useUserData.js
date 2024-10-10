import { useState, useEffect } from "react";

const useUserData = (userId) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    if (!userId) {
      setLoading(false);
      return; 
    }

    try {
      const res = await fetch(`http://localhost:3000/api/user/${userId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await res.json();
      setUserData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return { userData, loading, error };
};

export default useUserData;
