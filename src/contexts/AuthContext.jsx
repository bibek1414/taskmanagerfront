import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

const AuthContext = createContext({});

// Define the API base URL based on environment
// Note: Using window.location.hostname to dynamically determine if we're local or deployed
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost 
  ? 'http://localhost:8000' 
  : 'https://taskmangerback.onrender.com';

console.log(`Using API URL: ${API_URL}`);  // Debug log

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
    
    // Test the backend connection on component mount
    testBackendConnection();
  }, []);
  
  // Function to test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await fetch(`${API_URL}/api/test`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Backend connection successful:', data);
      } else {
        console.error('Backend test failed with status:', response.status);
      }
    } catch (error) {
      console.error('Backend connection test error:', error);
    }
  };

  const login = async (emailOrUsername, password) => {
    try {
      console.log(`Attempting login at ${API_URL}/api/auth/login`);
      
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      
      console.log('Login response status:', response.status);
  
      if (!response.ok) {
        let errorMessage = 'Login failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      console.log('Login successful, received token');
  
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
      console.log(`Attempting registration at ${API_URL}/api/auth/register`);
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        // Remove credentials: 'include' as it can cause CORS issues with preflight
        body: JSON.stringify(userData),
      });
      
      console.log('Registration response status:', response.status);
  
      if (!response.ok) {
        let errorMessage = 'Registration failed';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch (e) {
          console.error('Error parsing error response:', e);
        }
        throw new Error(errorMessage);
      }
  
      toast({
        title: "Success",
        description: "Registration successful! Please login.",
      });
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
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