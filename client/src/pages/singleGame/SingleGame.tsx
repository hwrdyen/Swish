import { useParams } from "react-router-dom";
import { GameData } from "../../config/game-config";
import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiRequest";

const SingleGame = () => {
  const { game_id } = useParams<string>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [singleGameData, setSingleGameData] = useState<GameData | null>(null);

  const fetchSingleGameInfo = async () => {
    try {
      const response = await apiRequest.get(`/game/${game_id}`);
      // Check if the response indicates no tour found
      if (response.data) {
        await setSingleGameData(response.data); // Set the tour data if found
      } else {
        setError("No game was associated with this ID."); // Set error message if no tour found
      }
    } catch (err) {
      console.error("Failed to fetch game data", err);
      setError("Failed to fetch game data."); // Set error message on fetch failure
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchSingleGameInfo();
  }, [game_id]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
      </div>
    ); // Show error message if there was an issue
  }

  return (
    <div>
      {singleGameData ? (
        <div>
          <div>Game ID: {game_id}</div>
          <div>
            Game Date: {new Date(singleGameData.game_date).toLocaleDateString()}
          </div>
          <div>Home Team: {singleGameData.home_team_id}</div>
          <div>Away Team: {singleGameData.away_team_id}</div>
        </div>
      ) : (
        <p>No games available</p> // Message for empty player_list
      )}
    </div>
  );
};

export default SingleGame;
