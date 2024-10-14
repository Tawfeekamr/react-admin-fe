import axios from 'axios';
import { create } from 'zustand';

import { BASE_URL } from '../utils/statics';

import type { User, AuthState } from '../types'; // Make sure the `User` type is imported

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  jwtToken: localStorage.getItem('jwtToken'),

  setUser: (user: User) => set({ user }), // Set the user in Zustand state
  setToken: (token: string) => {
    set({ jwtToken: token });
    localStorage.setItem('jwtToken', token);
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  },

  login: async (identifier: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/local`, {
        identifier,
        password,
      });

      const { jwt, user } = response.data;

      // Set the token and user in Zustand
      set({ user });
      set({ jwtToken: jwt });

      // Store token in localStorage and set Authorization header
      localStorage.setItem('jwtToken', jwt);
      axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getUser: async () => {
    try {
      axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jwtToken')}`;
      const response = await axios.get(`${BASE_URL}/api/users/me?populate=*&fields=*`);
      const user = response.data; // Adjust this based on the actual response structure
      set({ user });
      console.log('User: ***', user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('jwtToken');
    set({ user: null, jwtToken: null });
    delete axios.defaults.headers.common.Authorization;
  },
}));
