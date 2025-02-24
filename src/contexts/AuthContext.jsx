import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (emailOrUsername, password) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }
  
      const data = await response.json();
  
      // Save the token to localStorage
      localStorage.setItem('token', data.access_token);
  
      // Update the user state
      setUser({ token: data.access_token });
  
      // Redirect to the dashboard
      navigate('/dashboard');
  
      // Show success toast
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to login. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  const register = async (userData) => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Registration failed:", errorData);  // Log the error for debugging
        throw new Error(errorData.detail || 'Registration failed');
      }
  
      toast({
        title: "Success",
        description: "Registration successful! Please login.",
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    toast({
      title: "Success",
      description: "Logged out successfully!",
    });
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};