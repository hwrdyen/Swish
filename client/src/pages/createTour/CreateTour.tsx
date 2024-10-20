import { AxiosError } from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequest";
import { TeamData } from "../../config/team-config";
import { v4 as uuidv4 } from "uuid";

const CreateTour = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [teams, setTeams] = useState<string[]>([""]);

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const tournament_name = formData.get("tournament_name");
    const formattedTeamList = {
      connect: teams.map((teamId) => ({ id: teamId })),
    };

    try {
      apiRequest.post("/tour/create-tour", {
        id: uuidv4(),
        tournament_name,
        team_list: formattedTeamList,
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

  const addTeamSelect = () => {
    setTeams([...teams, ""]); // Add a new empty string for the new input
  };

  const removeTeam = (index: number) => {
    const newTeams = teams.filter((_, i) => i !== index); // Remove player at the given index
    setTeams(newTeams);
  };

  const [availableTeams, setAvailableTeams] = useState<TeamData[]>([]);
  // Fetch all users when the component mounts
  const fetchTeams = async () => {
    try {
      const response = await apiRequest.get("/team/all-teams"); // Replace with your API endpoint to fetch users
      setAvailableTeams(response.data);
    } catch (error) {
      console.log("Error fetching users:", error);
      setError("Failed to load players. Please try again.");
    }
  };
  useEffect(() => {
    fetchTeams();
  }, []);

  const handleTeamSelectChange = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  };

  return (
    <div>
      <div>
        {isLoggedIn ? (
          <form onSubmit={handleSubmit}>
            <h1>Create Your Tournament</h1>
            <input
              type="text"
              name="tournament_name"
              placeholder="Tournament Name"
              required
            />
            <h2>Add Participated Team</h2>
            <div id="team_container">
              {teams.map((team, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <select
                    value={team}
                    onChange={(e) =>
                      handleTeamSelectChange(index, e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select Team {index + 1}
                    </option>
                    {availableTeams.map((availableTeam) => (
                      <option key={availableTeam.id} value={availableTeam.id}>
                        {availableTeam.team_name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeTeam(index)}
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
            <button type="button" onClick={addTeamSelect}>
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

export default CreateTour;
