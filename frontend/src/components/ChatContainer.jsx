import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useSocketStore } from "../store/useSocketStore";
import MessageInput from "./MessageInput";

const BACKEND_URL = "http://localhost:5001";

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
    markMessagesAsSeen,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  const bottomRef = useRef(null);

  const isSelectedUserOnline = onlineUsers.includes(String(selectedUser?.id));

  useEffect(() => {
    if (!selectedUser) return;

    const loadChat = async () => {
      await getMessages(selectedUser.id);
      await markMessagesAsSeen(selectedUser.id);
      subscribeToMessages();
    };

    loadChat();

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
        minWidth: 0,
        background:
          "radial-gradient(circle at top, rgba(43,15,7,0.9) 0%, rgba(19,6,2,1) 70%)",
      }}
    >
      <div
        style={{
          height: "84px",
          borderBottom: "1px solid rgba(196, 133, 82, 0.24)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          background: "rgba(29, 10, 5, 0.8)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "50px",
              height: "50px",
            }}
          >
            {selectedUser?.profile_pic ? (
              <img
                src={`${BACKEND_URL}${selectedUser.profile_pic}`}
                alt={selectedUser.full_name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #b57a4d",
                }}
              />
            ) : (
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#b57a4d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "800",
                  fontSize: "20px",
                  textTransform: "uppercase",
                }}
              >
                {selectedUser?.full_name?.charAt(0)}
              </div>
            )}

            <div
              style={{
                position: "absolute",
                bottom: "2px",
                right: "2px",
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: isSelectedUserOnline ? "#76e04b" : "#7b726b",
                border: "2px solid #1d0b05",
              }}
            />
          </div>

          <div>
            <div
              style={{
                color: "#f8dfc7",
                fontWeight: "800",
                fontSize: "20px",
              }}
            >
              {selectedUser?.full_name}
            </div>

            <div
              style={{
                color: isSelectedUserOnline ? "#76e04b" : "#c09a7a",
                fontSize: "13px",
                marginTop: "2px",
              }}
            >
              {isSelectedUserOnline ? "Online" : "Offline"}
            </div>
          </div>
        </div>

        <div
          style={{
            color: "#d1a984",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          Chat active
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
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
                  maxWidth: "360px",
                  background: isMe ? "#b57a4d" : "#2b130b",
                  color: "#fff",
                  padding: "14px 16px 10px 16px",
                  borderRadius: isMe
                    ? "18px 18px 6px 18px"
                    : "18px 18px 18px 6px",
                  border: "1px solid rgba(196, 133, 82, 0.35)",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                  wordBreak: "break-word",
                }}
              >
                {msg.image && (
                  <img
                    src={`${BACKEND_URL}${msg.image}`}
                    alt="chat"
                    style={{
                      width: "100%",
                      maxWidth: "260px",
                      borderRadius: "12px",
                      marginBottom: msg.text ? "10px" : "6px",
                      display: "block",
                    }}
                  />
                )}

                {msg.text && (
                  <div
                    style={{
                      fontSize: "17px",
                      lineHeight: "1.4",
                      marginBottom: "6px",
                    }}
                  >
                    {msg.text}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "11px",
                    opacity: 0.85,
                  }}
                >
                  <span>{formatMessageTime(msg.created_at)}</span>

                  {isMe && (
                    <span>
                      {msg.seen ? "✓✓ Seen" : "✓ Sent"}
                    </span>
                  )}
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
                background: "#2b130b",
                color: "#e2b992",
                padding: "12px 16px",
                borderRadius: "18px 18px 18px 6px",
                border: "1px solid rgba(196, 133, 82, 0.35)",
                fontStyle: "italic",
                maxWidth: "260px",
              }}
            >
              {typingUserName || selectedUser.full_name} kuca...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;