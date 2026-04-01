import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useSocketStore } from "./useSocketStore.js";
import { useAuthStore } from "./useAuthStore.js";

const playNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      660,
      audioContext.currentTime + 0.18,
    );

    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.02,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.22,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.22);

    oscillator.onended = () => {
      audioContext.close();
    };
  } catch (error) {
    console.log("Notification sound error:", error);
  }
};

const getMessagePreview = (message) => {
  if (message.image && !message.text) return "📷 Poslana slika";
  if (message.image && message.text) return `📷 ${message.text}`;
  if (message.text)
    return message.text.length > 35
      ? `${message.text.slice(0, 35)}...`
      : message.text;

  return "Nova poruka";
};

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
      const users = get().users;

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
        return;
      }

      if (!isOwnMessage) {
        const sender = users.find(
          (user) => Number(user.id) === Number(newMessage.sender_id),
        );

        const senderName = sender?.full_name || "Nova poruka";
        const preview = getMessagePreview(newMessage);

        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [newMessage.sender_id]:
              (state.unreadCounts[newMessage.sender_id] || 0) + 1,
          },
        }));

        toast(`${senderName}: ${preview}`);
        playNotificationSound();
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
