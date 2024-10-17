import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiRequest } from "../../lib/apiRequest";
import { v4 as uuidv4 } from "uuid";
import Dropzone from "../../components/dropzone/Dropzone";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // Store the dropped file
  const navigate = useNavigate();

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await apiRequest.post("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.avatarUrl; // Return Cloudinary URL
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const id = uuidv4();
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      let avatarUrl = null;

      // Upload the avatar to Cloudinary if a file was dropped
      if (avatarFile) {
        try {
          avatarUrl = await uploadToCloudinary(avatarFile);
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
        }
      }

      await apiRequest.post("/auth/register", {
        id,
        username,
        email,
        password,
        avatar: avatarUrl,
      });

      navigate("/login");
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
      <form onSubmit={handleSubmit}>
        <h1>Create Your Account</h1>
        <div>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          )}
          <Dropzone setAvatarFile={setAvatarFile} setPreview={setPreviewUrl} />
        </div>

        <input name="username" type="text" placeholder="User Name" required />
        <input name="email" type="text" placeholder="Email" required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
        />

        <button disabled={isLoading}>Register</button>
        {error && <span>{error}</span>}
        <p>
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
        <p>
          Return to Home Page <Link to={"/"}>Home</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
