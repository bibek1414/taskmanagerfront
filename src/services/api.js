// src/services/api.js
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost 
  ? 'http://localhost:8000' 
  : 'https://taskmangerback.onrender.com';

console.log(`API Service using URL: ${API_URL}`);

export const getAuthorizationHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = 'API request failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch (e) {
      console.error('Error parsing error response:', e);
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

const api = {
  testConnection: async () => {
    try {
      const response = await fetch(`${API_URL}/api/test`, {
        method: 'GET',
        mode: 'cors'
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Connection test error:', error);
      throw error;
    }
  },
  
  auth: {
    login: async (emailOrUsername, password) => {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailOrUsername, password }),
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Login error in API service:', error);
        throw error;
      }
    },
    
    register: async (userData) => {
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Registration error in API service:', error);
        throw error;
      }
    }
  },
  
  tasks: {
    getTasks: async (params = {}) => {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      
      try {
        const response = await fetch(`${API_URL}/api/tasks?${queryParams}`, {
          mode: 'cors',
          headers: {
            ...getAuthorizationHeader(),
          },
        });
        
        return handleResponse(response);
      } catch (error) {
        console.error('Get tasks error:', error);
        throw error;
      }
    },
    
    // Add other task-related methods here
  }
};

export default api;