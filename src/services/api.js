const API_URL = import.meta.env.VITE_API_URL;

console.log(`API Service using URL: ${API_URL}`);

export const getAuthorizationHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    throw new Error(errorData.detail || 'An error occurred');
  }
  return response.json();
};

const api = {
  testConnection: async () => {
    try {
      const response = await fetch(`${API_URL}/api/test`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Test connection error:', error);
      return { status: 'error', message: error.message };
    }
  },
  
  auth: {
    login: async (emailOrUsername, password) => {
      try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',  // Changed from 'include' to 'omit' for cross-origin requests
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailOrUsername, password }),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Login fetch error:', error);
        throw error;
      }
    },
    
    register: async (userData) => {
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',  // Changed from 'include' to 'omit'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Registration fetch error:', error);
        throw error;
      }
    },
  },
  
  tasks: {
    getTasks: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      try {
        const response = await fetch(`${API_URL}/api/tasks?${query}`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            ...getAuthorizationHeader(),
            'Content-Type': 'application/json',
          },
        });
        return handleResponse(response);
      } catch (error) {
        console.error('Get tasks error:', error);
        throw error;
      }
    },
    
    // Add other task methods with similar error handling
  },
};

export default api;