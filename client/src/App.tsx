import "./App.scss";
import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

import Layout from "./layouts/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";

function App() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "useContext(AuthContext) must be used within an AuthContextProvider"
    );
  }
  const { currentUser, isLoggedIn } = authContext;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                {isLoggedIn ? `Hello ${currentUser?.username}` : "Hello World"}
                {isLoggedIn ? `Hello ${currentUser?.avatar}` : "Hello World"}
              </Layout>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
