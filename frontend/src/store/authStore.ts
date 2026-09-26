import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  globalRole: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const getStoredToken = () => sessionStorage.getItem('token');
const getStoredUser = () => {
  const userStr = sessionStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getStoredToken(),
  user: getStoredUser(),
  setAuth: (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));
