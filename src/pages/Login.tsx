
import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const Login = () => {
  const { currentUser, login } = useData();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      const success = await login("guest@cleanura.com", "guestpassword");
      if (success) {
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Redirect if already logged in
  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md border-none shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-cleanura-700">
            Cleanura
          </CardTitle>
          <CardDescription className="text-gray-500">
            Login to access your sales reporting dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-xs text-cleanura-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-cleanura-600 hover:bg-cleanura-700"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Login as demo account:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEmail("admin@cleanura.com");
                  setPassword("adminpassword");
                }}
                className="text-sm"
              >
                Admin
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEmail("user@cleanura.com");
                  setPassword("userpassword");
                }}
                className="text-sm"
              >
                User
              </Button>
            </div>
            <Button
              onClick={handleGuestLogin}
              variant="ghost"
              className="mt-2 w-full text-sm"
            >
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
