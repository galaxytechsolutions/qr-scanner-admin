import React from "react";
import { Navigate } from "react-router-dom";

// Function to check if the user is authenticated
// Replace this with your actual authentication logic
const isAuthenticated = () => {
  // For example, check if a token exists in localStorage
  return !!localStorage.getItem("authUser");
};

const PrivateRoute = ({ component }) => {
  return isAuthenticated() ? component : <Navigate to="/login" />;
};

export default PrivateRoute;
