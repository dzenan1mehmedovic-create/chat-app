import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);

  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useSocketStore();
  const { authUser } = useAuthStore();

  const emitStopTyping = () => {
    if (!socket || !selectedUser) return;

    socket.emit("stopTyping", {
      receiverId: selectedUser.id,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!socket || !selectedUser || !authUser) return;

    if (value.trim()) {
      socket.emit("typing", {
        receiverId: selectedUser.id,
        senderName: authUser.full_name,
      });

      clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        emitStopTyping();
      }, 1200);
    } else {
      clearTimeout(typingTimeoutRef.current);
      emitStopTyping();
    }
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({ text });
    setText("");

    clearTimeout(typingTimeoutRef.current);
    emitStopTyping();
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        padding: "14px",
        borderTop: "1px solid #8b5e3c",
        backgroundColor: "#140904",
      }}
    >
      <input
        type="text"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Upiši poruku..."
        style={{
          flex: 1,
          padding: "12px 14px",
          borderRadius: "12px",
          border: "1px solid #8b5e3c",
          outline: "none",
          backgroundColor: "#1b0c05",
          color: "#fff",
          fontSize: "15px",
        }}
      />

      <button
        onClick={handleSend}
        style={{
          padding: "12px 18px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#8b5e3c",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Pošalji
      </button>
    </div>
  );
};

export default MessageInput;