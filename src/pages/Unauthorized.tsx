
import React from "react";
import { useData } from "../context/DataContext";
import { Button } from "../components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const { currentUser, logout } = useData();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-50 rounded-full">
            <Shield className="h-16 w-16 text-red-500" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          {currentUser
            ? `Sorry, your account (${currentUser.role}) doesn't have permission to access this page.`
            : "You need to be logged in to access this page."}
        </p>
        <div className="space-y-3">
          <Button
            className="w-full bg-cleanura-600 hover:bg-cleanura-700"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
          </Button>
          {currentUser ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
