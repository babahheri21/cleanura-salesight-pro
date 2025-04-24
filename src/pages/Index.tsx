
import React from "react";
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to Dashboard page instead of Login
  return <Navigate to="/dashboard" replace />;
};

export default Index;
