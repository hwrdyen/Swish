import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { apiRequest } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const CreateTeam = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [players, setPlayers] = useState<string[]>([""]);

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
    const team_creator = currentUser?.id;

    try {
      apiRequest.post("/team/created-teams", {
        id: uuidv4(),
        team_name,
        team_creator,
        player_list: players,
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

  const addSelect = () => {
    setPlayers([...players, ""]); // Add a new empty string for the new input
  };

  const handleInputChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const removePlayer = (index: number) => {
    const newPlayers = players.filter((_, i) => i !== index); // Remove player at the given index
    setPlayers(newPlayers);
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
            <div>Add Player</div>
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
                  <input
                    type="text"
                    value={player}
                    placeholder={`Player ${index + 1}`}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                  />
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
            <button type="button" onClick={addSelect}>
              + {/* Button to add a new input */}
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
