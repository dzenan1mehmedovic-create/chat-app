import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const { sendMessage } = useChatStore();

  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage({ text });
    setText("");
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
        onChange={(e) => setText(e.target.value)}
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