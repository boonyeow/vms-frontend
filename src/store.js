import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      accountId: null,
      token: null,
      email: null,
      role: null,
      setToken: (data) => {
        set((state) => ({
          accountId: data["accountId"],
          token: data["token"],
          email: data["email"],
          role: data["accountType"],
        }));
      },
      clearStore: () => {
        set(() => ({
          accountId: null,
          token: null,
          email: null,
          role: null,
        }));
      },
    }),
    {
      name: "authStore",
      getStorage: () => localStorage, // specify localStorage as the storage backend
    }
  )
);
