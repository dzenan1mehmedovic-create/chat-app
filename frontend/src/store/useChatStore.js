import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { useSocketStore } from "./useSocketStore.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  typingUserId: null,
  typingUserName: "",
  unreadCounts: {},

  getUsers: async () => {
    set({ isUsersLoading: true });

    try {
      const res = await axiosInstance.get("/messages/users");
      set((state) => ({
        users: res.data,
        unreadCounts: state.unreadCounts || {},
      }));
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
      set((state) => ({
        messages: res.data,
        unreadCounts: {
          ...state.unreadCounts,
          [userId]: 0,
        },
      }));
    } catch (error) {
      console.log(error);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  markMessagesAsSeen: async (userId) => {
    try {
      await axiosInstance.put(`/messages/seen/${userId}`);

      set((state) => ({
        messages: state.messages.map((msg) =>
          Number(msg.sender_id) === Number(userId) ? { ...msg, seen: 1 } : msg,
        ),
        unreadCounts: {
          ...state.unreadCounts,
          [userId]: 0,
        },
      }));
    } catch (error) {
      console.log(error);
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

      set({
        messages: [...messages, res.data],
      });
    } catch (error) {
      console.log(error);
    }
  },

  setSelectedUser: (selectedUser) =>
    set((state) => ({
      selectedUser,
      typingUserId: null,
      typingUserName: "",
      messages: [],
      unreadCounts: {
        ...state.unreadCounts,
        [selectedUser?.id]: 0,
      },
    })),

  subscribeToMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (!socket) return;

    const authUser = useAuthStore.getState().authUser;

    socket.off("newMessage");
    socket.off("showTyping");
    socket.off("hideTyping");
    socket.off("messagesSeen");

    socket.on("newMessage", (newMessage) => {
      const currentSelectedUser = get().selectedUser;

      const isOwnMessage =
        Number(newMessage.sender_id) === Number(authUser?.id);

      const isCurrentChatOpen =
        currentSelectedUser &&
        Number(newMessage.sender_id) === Number(currentSelectedUser.id);

      if (isCurrentChatOpen) {
        set((state) => ({
          messages: [...state.messages, newMessage],
          typingUserId: null,
          typingUserName: "",
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.sender_id]: 0,
          },
        }));

        get().markMessagesAsSeen(newMessage.sender_id);
      } else if (!isOwnMessage) {
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.sender_id]:
              (state.unreadCounts[newMessage.sender_id] || 0) + 1,
          },
        }));
      }
    });

    socket.on("showTyping", (data) => {
      const currentSelectedUser = get().selectedUser;
      if (!currentSelectedUser) return;
      if (Number(data.senderId) !== Number(currentSelectedUser.id)) return;

      set({
        typingUserId: data.senderId,
        typingUserName: data.senderName,
      });
    });

    socket.on("hideTyping", (data) => {
      const currentSelectedUser = get().selectedUser;
      if (!currentSelectedUser) return;
      if (Number(data.senderId) !== Number(currentSelectedUser.id)) return;

      set({
        typingUserId: null,
        typingUserName: "",
      });
    });

    socket.on("messagesSeen", () => {
      set((state) => ({
        messages: state.messages.map((msg) =>
          Number(msg.sender_id) === Number(authUser?.id)
            ? { ...msg, seen: 1 }
            : msg,
        ),
      }));
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useSocketStore.getState().socket;
    if (socket) {
      socket.off("newMessage");
      socket.off("showTyping");
      socket.off("hideTyping");
      socket.off("messagesSeen");
    }
  },
}));
