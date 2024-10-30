import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserProfile } from "../../config/user-config";
import { apiRequest } from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { AxiosError } from "axios";

const Profile = () => {
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { updateUser } = authContext;

  const handleLogout = async () => {
    setLogoutLoading(true);

    try {
      await apiRequest.post("/auth/logout");
      await updateUser(null);
      navigate("/");
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log(err.response?.data.message);
      } else {
        console.log("Error:", err);
      }
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await apiRequest.delete("/user/delete-me");
      await updateUser(null);
      navigate("/");
    } catch (err) {
      console.error("Failed to fetch profile data", err);
      setError("Failed to fetch profile data."); // Set error message on fetch failure
    } finally {
      setDeleteLoading(false); // Stop loading when done
    }
  };

  const fetchProfileInfo = async () => {
    try {
      const response = await apiRequest.get(`/user/me`);
      // Check if the response indicates no team found
      if (response.data) {
        setProfileData(response.data); // Set the team data if found
      } else {
        setError("No team was associated with this ID."); // Set error message if no team found
      }
    } catch (err) {
      console.error("Failed to fetch profile data", err);
      setError("Failed to fetch profile data."); // Set error message on fetch failure
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []); // Fetch when team_id changes

  if (loading || logoutLoading) {
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
        {profileData ? (
          <div>
            <h1>User Id: {profileData.id}</h1>
            <h1>User name: {profileData.username}</h1>
            <h1>User email: {profileData.email}</h1>
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="User Avatar" />
            ) : (
              <img
                src={"/user-avatar.png"}
                alt="Default Avatar"
                style={{ width: "100px", height: "100px" }}
              />
            )}
          </div>
        ) : (
          <div>Loading...</div> // Show loading indicator while fetching data
        )}
      </div>
      <button onClick={handleLogout} disabled={logoutLoading}>
        Logout
      </button>
      <button onClick={handleDelete} disabled={deleteLoading}>
        Delete User
      </button>
    </div>
  );
};

export default Profile;
