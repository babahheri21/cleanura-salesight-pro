
import React from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import { useData } from "../../context/DataContext";
import { Navigate } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user" | "guest";
}

const MainLayout = ({ children, requiredRole }: MainLayoutProps) => {
  const { currentUser } = useData();
  
  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if user has required role
  if (requiredRole && currentUser.role !== requiredRole && 
      !(requiredRole === "user" && currentUser.role === "admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
