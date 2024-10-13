import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const login = async (identifier: string, password: string) => {
  const response = await axios.post(`${BASE_URL}/api/auth/local`, {
    identifier,
    password,
  });

  // Store the JWT token in local storage or cookies
  localStorage.setItem('jwtToken', response.data.jwt);

  return response.data;
};

export const logout = () => {
  // Remove the JWT token from local storage or cookies
  localStorage.removeItem('jwtToken');
};
