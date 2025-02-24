import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';

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
    
    // Test the backend connection on component mount
    testBackendConnection();
  }, []);
  
  // Function to test backend connection
  const testBackendConnection = async () => {
    try {
      console.log('Testing backend connection...');
      const response = await api.testConnection();
      
      if (response.status === 'ok') {
        console.log('Backend connection successful:', response);
      } else {
        console.error('Backend test failed with status:', response.status);
      }
    } catch (error) {
      console.error('Backend connection test error:', error);
    }
  };

  const login = async (emailOrUsername, password) => {
    try {
      console.log('Attempting login');
      
      const data = await api.auth.login(emailOrUsername, password);
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
      console.log('Attempting registration');
      
      await api.auth.register(userData);
  
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