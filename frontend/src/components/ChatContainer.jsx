import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import MessageInput from "./MessageInput";

const formatMessageTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ChatContainer = () => {
  const {
    selectedUser,
    messages,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    typingUserId,
    typingUserName,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser.id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUserId]);

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#140904",
      }}
    >
      <div
        style={{
          padding: "16px",
          borderBottom: "1px solid #8b5e3c",
          color: "#f5d2b3",
          fontWeight: "bold",
          fontSize: "24px",
        }}
      >
        {selectedUser.full_name}
      </div>

      <div
        style={{
          flex: 1,
          padding: "16px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.map((msg) => {
          const isMe = Number(msg.sender_id) === Number(authUser.id);

          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  backgroundColor: isMe ? "#8b5e3c" : "#2f1c12",
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  maxWidth: "60%",
                  wordBreak: "break-word",
                  border: "1px solid #8b5e3c",
                }}
              >
                <div style={{ marginBottom: "4px" }}>{msg.text}</div>

                <div
                  style={{
                    fontSize: "11px",
                    opacity: 0.7,
                    textAlign: "right",
                  }}
                >
                  {formatMessageTime(msg.created_at)}
                </div>
              </div>
            </div>
          );
        })}

        {typingUserId && Number(typingUserId) === Number(selectedUser.id) && (
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                backgroundColor: "#2f1c12",
                color: "#d8b08b",
                padding: "10px 14px",
                borderRadius: "14px",
                border: "1px solid #8b5e3c",
                fontStyle: "italic",
                maxWidth: "60%",
              }}
            >
              {typingUserName || selectedUser.full_name} kuca...
            </div>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;