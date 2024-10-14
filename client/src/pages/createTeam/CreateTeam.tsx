import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { apiRequest } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";

const CreateTeam = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { currentUser, isLoggedIn } = authContext;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const team_name = formData.get("team_name");
    const team_creator = currentUser?.id;

    try {
      apiRequest.post("/team", {
        team_name,
        team_creator,
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

  return (
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
          <button disabled={isLoading}>Create</button>
          {error && <span>{error}</span>}
        </form>
      ) : (
        <div>
          please logged in at <Link to={"/login"}>Login</Link>{" "}
        </div>
      )}
    </div>
  );
};

export default CreateTeam;
