import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../../lib/apiRequest";
import { TeamData } from "../../config/team-config";

const SingleTeam = () => {
  const { team_id } = useParams<string>(); // Specify type for useParams
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize singleTeamData with a default value that adheres to the TeamData interface
  const [singleTeamData, setSingleTeamData] = useState<TeamData | null>(null);

  const fetchSingleTeamInfo = async () => {
    try {
      const response = await apiRequest.get(`/team/${team_id}`);
      // Check if the response indicates no team found
      if (response.data) {
        setSingleTeamData(response.data); // Set the team data if found
      } else {
        setError("No team was associated with this ID."); // Set error message if no team found
      }
    } catch (err) {
      console.error("Failed to fetch team data", err);
      setError("Failed to fetch team data."); // Set error message on fetch failure
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchSingleTeamInfo();
  }, [team_id]); // Fetch when team_id changes

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
        {singleTeamData ? (
          <div>
            <h1>Team name: {singleTeamData.team_name}</h1>
            <h1>Team creator: {singleTeamData.team_creator}</h1>
            <h1>Team Players:</h1>
            <div>
              {Array.isArray(singleTeamData.player_list) &&
              singleTeamData.player_list.length > 0 ? ( // Type guard for player_list
                <ul>
                  {singleTeamData.player_list.map((player, index) => (
                    <li key={index}>{player}</li> // Assuming player is a string or adjust based on the player structure
                  ))}
                </ul>
              ) : (
                <p>No players available</p> // Message for empty player_list
              )}
            </div>
          </div>
        ) : (
          <div>Loading...</div> // Show loading indicator while fetching data
        )}
      </div>
      <Link to={"/"}>Home</Link>
    </div>
  );
};

export default SingleTeam;
