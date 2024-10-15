import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserProfile } from "../../config/user-config";
import { apiRequest } from "../../lib/apiRequest";

const Profile = () => {
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  //   const authContext = useContext(AuthContext);
  //   if (!authContext) {
  //     throw new Error(
  //       "useContext(AuthContext) must be used within an AuthContextProvider"
  //     );
  //   }
  //   const { currentUser, isLoggedIn } = authContext;

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
      console.error("Failed to fetch team data", err);
      setError("Failed to fetch team data."); // Set error message on fetch failure
    } finally {
      setLoading(false); // Stop loading when done
    }
  };

  useEffect(() => {
    fetchProfileInfo();
  }, []); // Fetch when team_id changes

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
        {profileData ? (
          <div>
            <h1>User Id: {profileData.id}</h1>
            <h1>User name: {profileData.username}</h1>
            <h1>User email: {profileData.email}</h1>
          </div>
        ) : (
          <div>Loading...</div> // Show loading indicator while fetching data
        )}
      </div>
      <Link to={"/"}>Home</Link>
    </div>
  );
};

export default Profile;
