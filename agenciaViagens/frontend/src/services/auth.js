import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const login = async (email, senha) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
    const token = response.data.access_token;
    setAuthToken(token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  setAuthToken(null);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
