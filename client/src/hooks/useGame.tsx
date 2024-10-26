import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest"; // Adjust path as needed
import { GameData } from "../config/game-config";

export const useGames = () => {
  const [allGameData, setAllGameData] = useState<GameData[]>([]);
  const [fetchingGames, setFetchingGames] = useState(true);

  const fetchGames = async () => {
    try {
      const response = await apiRequest.get("/game/all");
      setAllGameData(response.data);
    } catch (error) {
      console.error("Failed to fetch game data", error);
    } finally {
      setFetchingGames(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [allGameData]);

  return { allGameData, fetchingGames, fetchGames };
};
