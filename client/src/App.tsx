import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Home from "./pages/home/Home";
import CreateTeam from "./pages/createTeam/CreateTeam";
import SingleTeam from "./pages/singleTeam/SingleTeam";
import Profile from "./pages/profile/Profile";
import CreateTour from "./pages/createTour/CreateTour";
import SingleTour from "./pages/singleTour/SingleTour";
import CreateGame from "./pages/createGame/CreateGame";
import SingleGame from "./pages/singleGame/SingleGame";

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
          <Route
            path="/profile"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
          <Route
            path="/create-team"
            element={
              <Layout>
                <CreateTeam />
              </Layout>
            }
          />
          <Route
            path="/team/:team_id"
            element={
              <Layout>
                <SingleTeam />
              </Layout>
            }
          />
          <Route
            path="/create-tour"
            element={
              <Layout>
                <CreateTour />
              </Layout>
            }
          />
          <Route
            path="/tour/:tour_id"
            element={
              <Layout>
                <SingleTour />
              </Layout>
            }
          />
          <Route
            path="/create-game"
            element={
              <Layout>
                <CreateGame />
              </Layout>
            }
          />
          <Route
            path="/game/:game_id"
            element={
              <Layout>
                <SingleGame />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
