import { RegisterFormData } from "./config/auth-config";
// const API_BASE_URL = import.meta.env.API_BASE_URL;

export const register = async (formData: RegisterFormData) => {
  const response = await fetch(`http://localhost:8080/api/auth/register`, {
    method: "POST",
    credentials: "include",
    //  credentials: "include" ==>
    // when making a POST request, we want to include any HTTP cookies along with the request,
    // and we also want to set any cookies that we get back from the server on the browser
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const responseBody = await response.json();

  if (!response.ok) {
    throw new Error(responseBody.message);
  }

  // Return the response body for further use if necessary
  return responseBody;
};
