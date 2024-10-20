import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { apiRequest } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { UserProfile } from "../../config/user-config";

const CreateTeam = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [players, setPlayers] = useState<string[]>([""]);
  const [coaches, setCoaches] = useState<string[]>([""]);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { currentUser, isLoggedIn } = authContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const team_name = formData.get("team_name");
    const team_creator_id = currentUser?.id;
    const formattedPlayerList = {
      connect: players.map((playerId) => ({ id: playerId })),
    };
    const formattedCoachList = {
      connect: coaches.map((coachId) => ({ id: coachId })),
    };

    try {
      apiRequest.post("/team/created-teams", {
        id: uuidv4(),
        team_name,
        team_creator_id,
        player_list: formattedPlayerList,
        coach_list: formattedCoachList,
      });
      navigate("/");
    } catch (err) {
      // Check if the error is an instance of AxiosError
      if (err instanceof AxiosError) {
        // Access error message from the response data
        console.log(err.response?.data.message);
        setError(err.response?.data.message || "An error occurred.");
      } else {
        // Handle non-Axios errors
        console.log("Error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Ensure loading state is reset
      setIsLoading(false);
    }
  };

  const addPlayerSelect = () => {
    setPlayers([...players, ""]); // Add a new empty string for the new input
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index); // Remove player at the given index
    setPlayers(newPlayers);
  };

  const addCoachSelect = () => {
    setCoaches([...coaches, ""]); // Add a new empty string for the new input
  };

  const removeCoach = (index: number) => {
    const newCoaches = coaches.filter((_, i) => i !== index); // Remove player at the given index
    setCoaches(newCoaches);
  };

  const [availableUsers, setAvailableUsers] = useState<UserProfile[]>([]);
  // Fetch all users when the component mounts
  const fetchUsers = async () => {
    try {
      const response = await apiRequest.get("/user/users"); // Replace with your API endpoint to fetch users
      setAvailableUsers(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
      setError("Failed to load players. Please try again.");
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePlayerSelectChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };
  const handleCoachSelectChange = (index: number, value: string) => {
    const newCoaches = [...coaches];
    newCoaches[index] = value;
    setCoaches(newCoaches);
  };

  return (
    <div>
      <div>
        {isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            <h1>Create Your Team</h1>
            <input
              type="text"
              name="team_name"
              placeholder="Team Name"
              required
            />

            {/* Add Player List */}
            <h2>Add Player</h2>
            <div id="player__container">
              {players.map((player, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <select
                    value={player}
                    onChange={(e) =>
                      handlePlayerSelectChange(index, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select Player {index + 1}
                    </option>
                    {availableUsers.map((availableUser) => (
                      <option key={availableUser.id} value={availableUser.id}>
                        {availableUser.username}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removePlayer(index)}
                    style={{
                      marginLeft: "8px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addPlayerSelect}>
              +
            </button>

            {/* Add Coach List */}
            <h2>Add Coach</h2>
            <div id="coach_container">
              {coaches.map((coach, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <select
                    value={coach}
                    onChange={(e) =>
                      handleCoachSelectChange(index, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select Coach {index + 1}
                    </option>
                    {availableUsers.map((availableUser) => (
                      <option key={availableUser.id} value={availableUser.id}>
                        {availableUser.username}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeCoach(index)}
                    style={{
                      marginLeft: "8px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addCoachSelect}>
              +
            </button>
            <button disabled={isLoading}>Create</button>
            {error && <span>{error}</span>}
          </form>
        ) : (
          <div>
            please login at <Link to={"/login"}>Login</Link>{" "}
          </div>
        )}
      </div>
      <Link to={"/"}>Home</Link>
    </div>
  );
};

export default CreateTeam;
