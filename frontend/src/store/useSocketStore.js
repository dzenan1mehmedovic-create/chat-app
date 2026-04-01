import { create } from "zustand";
import { io } from "socket.io-client";

export const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: (userId) => {
    const { socket } = get();

    if (!userId) return;
    if (socket?.connected) return;

    const newSocket = io("http://localhost:5001", {
      query: {
        userId: String(userId),
      },
      withCredentials: true,
    });

    newSocket.on("getOnlineUsers", (users) => {
      set({ onlineUsers: users });
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const { socket } = get();

    if (socket) {
      socket.disconnect();
    }

    set({
      socket: null,
      onlineUsers: [],
    });
  },
}));
