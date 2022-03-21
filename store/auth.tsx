import createStore from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IUser {
  email: string;
  id: number;
  jwt: string;
  name: string;
  role: string;
}

const store = (set: any) => ({
  isAuthenticated: false,
  user: null,
  handleSignout: () => {
    set({
      user: null,
      isAuthenticated: false,
    });
  },
  setAuth: (user: IUser) => {
    set({
      user: user,
      isAuthenticated: true,
    });
  },
});

export const useAuth = createStore(
  persist(devtools(store), {
    name: "eval-admin", // unique name
    getStorage: () => localStorage, // (optional) by default, 'localStorage' is used
  })
);
