import React from "react";
import { useAuth } from "../AuthCOntext";
import { Navigate } from "react-router-dom";

// Component to protect routes from unauthenticated access
const PrivateRoute = ({ children }) => {
  const { user } = useAuth(); // Get the current user from AuthContext

  // If user is not logged in, redirect them to the home/login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated, render the protected content
  return children;
};

export default PrivateRoute;
