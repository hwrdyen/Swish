import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { TourData } from "../../config/tournament-config";
import { apiRequest } from "../../lib/apiRequest";

const SingleTour = () => {
  const { tour_id } = useParams<string>(); // Specify type for useParams
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [singleTourData, setSingleTourData] = useState<TourData | null>(null);

  const fetchSingleTourInfo = async () => {
    try {
      const response = await apiRequest.get(`/tour/${tour_id}`);
      // Check if the response indicates no tour found
      if (response.data) {
        setSingleTourData(response.data); // Set the tour data if found
      } else {
        setError("No tour was associated with this ID."); // Set error message if no tour found
      }
    } catch (err) {
      console.error("Failed to fetch tour data", err);
      setError("Failed to fetch tour data."); // Set error message on fetch failure
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchSingleTourInfo();
  }, [tour_id]);

  if (loading) {
    return <div>Loading...</div>; // Show loading indicator while fetching data
  }

  if (error) {
    return (
      <div>
        <div>{error}</div>
        <Link to={"/"}>Home</Link>
      </div>
    ); // Show error message if there was an issue
  }

  return (
    <div>
      <div>
        {singleTourData ? (
          <div>
            <h1>Tournament name: {singleTourData.tournament_name}</h1>
            <div>
              <h1>Participated Team:</h1>
              <ul>
                {singleTourData.team_list.map((team) => (
                  <li key={team.id}>{team.team_name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h1>Planned Game:</h1>
              {singleTourData.game_list &&
              singleTourData.game_list.length > 0 ? (
                <ul>
                  {singleTourData.game_list.map((game) => (
                    <li key={game.id}>
                      {game.home_team_id} vs {game.away_team_id} at{" "}
                      {new Date(game.game_date).toISOString()}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No games available</p> // Added a fallback message for no games
              )}
            </div>
          </div>
        ) : (
          <p>No players available</p> // Message for empty player_list
        )}
      </div>
    </div>
  );
};

export default SingleTour;
