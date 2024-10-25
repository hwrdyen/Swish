import { AxiosError } from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { apiRequest } from "../../lib/apiRequest";
import { v4 as uuidv4 } from "uuid";
import { useTours } from "../../hooks/useTour";
import { useTeams } from "../../hooks/useTeam";

const CreateTour = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchTours } = useTours();
  const [teams, setTeams] = useState<string[]>([""]);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { isLoggedIn } = authContext;
  const { allTeamData } = useTeams();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const tournament_name = formData.get("tournament_name");
    const formattedTeamList = {
      connect: teams.map((teamId) => ({ id: teamId })),
    };

    try {
      await apiRequest.post("/tour/create-tour", {
        id: uuidv4(),
        tournament_name,
        team_list: formattedTeamList,
      });
      await fetchTours();
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
        setError(err.response?.data.message || "An error occurred.");
      } else {
        console.log("Error:", err);
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addTeamSelect = () => setTeams([...teams, ""]);
  const removeTeam = (index: number) => {
    setTeams(teams.filter((_, i) => i !== index));
  };
  const handleTeamSelectChange = (index: number, value: string) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  };

  return (
    <div>
      {isLoggedIn ? (
        allTeamData.length > 0 ? (
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
                    {allTeamData.map((allTeamSingleData) => (
                      <option
                        key={allTeamSingleData.id}
                        value={allTeamSingleData.id}
                      >
                        {allTeamSingleData.team_name}
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
            <button type="submit" disabled={isLoading}>
              Create
            </button>
            {error && <span>{error}</span>}
          </form>
        ) : (
          <Link to={"/create-team"}>Create Team First</Link>
        )
      ) : (
        <div>
          Please login at <Link to={"/login"}>Login</Link>
        </div>
      )}
      <Link to={"/"}>Home</Link>
    </div>
  );
};

export default CreateTour;
