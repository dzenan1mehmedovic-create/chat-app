import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);

  const { sendMessage, selectedUser } = useChatStore();
  const { socket } = useSocketStore();
  const { authUser } = useAuthStore();
  const { themes, currentThemeKey } = useThemeStore();

  const theme = themes[currentThemeKey];

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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
    setImageName(file.name);
  };

  const handleSend = async () => {
    if (!text.trim() && !image) return;

    await sendMessage({ text, image });

    setText("");
    setImage(null);
    setImageName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

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
        borderTop: `1px solid ${theme.borderSoft}`,
        padding: "18px 22px",
        background: theme.panelSoft,
      }}
    >
      {imageName && (
        <div
          style={{
            marginBottom: "10px",
            color: theme.subtext,
            fontSize: "13px",
          }}
        >
          Odabrana slika: {imageName}
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            height: "56px",
            padding: "0 18px",
            borderRadius: "16px",
            border: `1px solid ${theme.border}`,
            background: theme.inputBg,
            color: "#fff",
            fontWeight: "700",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          📷
        </button>

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
            border: `1px solid ${theme.border}`,
            background: theme.inputBg,
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
            background: theme.accent,
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