import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useSocketStore } from "./useSocketStore.js";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUserId: null,
  typingUserName: "",

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const formData = new FormData();

      if (messageData.text) {
        formData.append("text", messageData.text);
      }

      if (messageData.image) {
        formData.append("image", messageData.image);
      }

      const res = await axiosInstance.post(
        `/messages/send/${selectedUser.id}`,
        formData,
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log(error);
    }
  },

  setSelectedUser: (selectedUser) =>
    set({
      selectedUser,
      typingUserId: null,
      typingUserName: "",
      messages: [],
    }),

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    socket.off("newMessage");
    socket.off("showTyping");
    socket.off("hideTyping");

    socket.on("newMessage", (newMessage) => {
      if (Number(newMessage.sender_id) !== Number(selectedUser.id)) return;

      set({
        messages: [...get().messages, newMessage],
        typingUserId: null,
        typingUserName: "",
      });
    });

    socket.on("showTyping", (data) => {
      if (Number(data.senderId) !== Number(selectedUser.id)) return;

      set({
        typingUserId: data.senderId,
        typingUserName: data.senderName,
      });
    });

    socket.on("hideTyping", (data) => {
      if (Number(data.senderId) !== Number(selectedUser.id)) return;

      set({
        typingUserId: null,
        typingUserName: "",
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("showTyping");
      socket.off("hideTyping");
    }
  },
}));
