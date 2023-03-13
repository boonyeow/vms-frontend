import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      email: null,
      role: null,
      setToken: (data) => {
        set((state) => ({
          token: data["token"],
          email: data["email"],
          role: data["accountType"],
        }));
      },
    }),
    {
      name: "authStore",
      getStorage: () => localStorage, // specify localStorage as the storage backend
    }
  )
);
