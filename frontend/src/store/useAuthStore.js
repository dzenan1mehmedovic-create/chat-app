import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useSocketStore } from "./useSocketStore.js";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });

      useSocketStore.getState().connectSocket(res.data.id);
    } catch {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data });

      useSocketStore.getState().connectSocket(res.data.id);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Greška pri registraciji",
      };
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });

      useSocketStore.getState().connectSocket(res.data.id);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Greška pri prijavi",
      };
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      useSocketStore.getState().disconnectSocket();
      set({ authUser: null });
    } catch (error) {
      console.log(error);
    }
  },

  updateProfile: async ({ full_name, profile_pic }) => {
    set({ isUpdatingProfile: true });

    try {
      const formData = new FormData();

      if (full_name) {
        formData.append("full_name", full_name);
      }

      if (profile_pic) {
        formData.append("profile_pic", profile_pic);
      }

      const res = await axiosInstance.put("/auth/update-profile", formData);

      set({ authUser: res.data });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Greška pri update profila",
      };
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
