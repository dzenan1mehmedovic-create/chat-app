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
        borderTop: "1px solid rgba(196, 133, 82, 0.24)",
        padding: "18px 22px",
        background: "rgba(25, 9, 4, 0.82)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <input
          type="text"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          style={{
            flex: 1,
            height: "56px",
            borderRadius: "16px",
            border: "1px solid rgba(196, 133, 82, 0.35)",
            background: "rgba(39, 13, 6, 0.9)",
            color: "#fff",
            outline: "none",
            padding: "0 18px",
            fontSize: "15px",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={handleSend}
          style={{
            height: "56px",
            padding: "0 22px",
            borderRadius: "16px",
            border: "none",
            background: "#b57a4d",
            color: "#fff",
            fontWeight: "800",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInput;