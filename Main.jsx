import React from "react";
import { useAuth } from "../AuthCOntext";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import TravelForm from "./TravelForm";

const Main = () => {
  const { user } = useAuth(); // Get current user from AuthContext
  const navigate = useNavigate(); // Initialize navigation

  // If user is not authenticated, show a fallback message
  if (!user) {
    return <div>Loading or not authenticated...</div>;
  }

  return (
    // Container with some padding and max width
    <div className="p-6 max-w-lg mx-auto space-y-4">
      {/* Render the travel planning form */}
      <TravelForm />
    </div>
  );
};

export default Main;
