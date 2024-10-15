import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import CreateTeam from "./pages/createTeam/CreateTeam";
import SingleTeam from "./pages/singleTeam/SingleTeam";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-team" element={<CreateTeam />} />
          <Route path="/team/:team_id" element={<SingleTeam />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
