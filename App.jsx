import React from "react";
import "./App.css";
import Login from "./components/Login";
import Main from "./components/Main";
import ProfileIcon from "./components/ProfileIcon";
import ProfilePage from "./components/ProfilePage";
import ProfilePlanDetials from "./components/ProfilePlanDetials";
import PrivateRoute from "./components/PrivateRoute";
import { getAuth } from "firebase/auth";
import { LoadScript } from "@react-google-maps/api";
import { Routes, Route, useLocation } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandinPage from "./components/LandinPage";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const user = getAuth().currentUser;

  return (
    <>
      {!isLoginPage && (
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">AI-Trip Planner</h1>
          {user && <ProfileIcon />}
        </div>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<LandinPage />} />
        <Route
          path="/main"
          element={
            <PrivateRoute>
              <Main />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/plan/:id"
          element={
            <PrivateRoute>
              <ProfilePlanDetials />
            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

const App = () => (
  <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
    <AppContent />
  </LoadScript>
);

export default App;
