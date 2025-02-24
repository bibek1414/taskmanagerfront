const API_URL = import.meta.env.VITE_API_URL;

console.log(`API Service using URL: ${API_URL}`);

export const getAuthorizationHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'An error occurred');
  }
  return response.json();
};

const api = {
  testConnection: async () => {
    const response = await fetch(`${API_URL}/api/test`);
    return handleResponse(response);
  },
  
  auth: {
    login: async (emailOrUsername, password) => {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      return handleResponse(response);
    },
    
    register: async (userData) => {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return handleResponse(response);
    },
  },
  
  tasks: {
    getTasks: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const response = await fetch(`${API_URL}/api/tasks?${query}`, {
        headers: getAuthorizationHeader(),
      });
      return handleResponse(response);
    },
  },
};

export default api;