
import React from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { data: { session } } = supabase.auth.getSession();
  
  // If there's an active session, go to dashboard
  // Otherwise, redirect to login
  return session ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default Index;
