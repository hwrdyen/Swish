import { AxiosError } from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
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
      </form>
    </div>
  );
};

export default Register;
