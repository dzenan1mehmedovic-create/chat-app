import { useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import { useAuthStore } from "../store/useAuthStore";

const Sidebar = () => {
  const { users, setSelectedUser, selectedUser, messages } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { authUser } = useAuthStore();

  const [search, setSearch] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const getLastMessagePreview = (userId) => {
    const chatMessages = messages.filter(
      (msg) =>
        (Number(msg.sender_id) === Number(authUser?.id) &&
          Number(msg.receiver_id) === Number(userId)) ||
        (Number(msg.sender_id) === Number(userId) &&
          Number(msg.receiver_id) === Number(authUser?.id)),
    );

    if (!chatMessages.length) return "Klikni za otvaranje chata";

    const lastMessage = chatMessages[chatMessages.length - 1];

    if (!lastMessage?.text?.trim()) return "Poslana poruka";

    return lastMessage.text.length > 26
      ? `${lastMessage.text.slice(0, 26)}...`
      : lastMessage.text;
  };

  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search.trim()) {
      result = result.filter((user) =>
        user.full_name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (showOnlineOnly) {
      result = result.filter((user) => onlineUsers.includes(String(user.id)));
    }

    result.sort((a, b) => {
      const aOnline = onlineUsers.includes(String(a.id));
      const bOnline = onlineUsers.includes(String(b.id));

      if (aOnline && !bOnline) return -1;
      if (!aOnline && bOnline) return 1;

      return a.full_name.localeCompare(b.full_name);
    });

    return result;
  }, [users, search, showOnlineOnly, onlineUsers]);

  return (
    <div
      style={{
        width: "340px",
        borderRight: "1px solid rgba(196, 133, 82, 0.28)",
        background: "linear-gradient(180deg, #180803 0%, #130602 100%)",
        display: "flex",
        flexDirection: "column",
        minWidth: "340px",
      }}
    >
      <div
        style={{
          padding: "24px 18px 16px 18px",
          borderBottom: "1px solid rgba(196, 133, 82, 0.18)",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: "#f8dfc7",
            marginBottom: "16px",
          }}
        >
          Contacts
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "14px",
            border: "1px solid rgba(196, 133, 82, 0.3)",
            background: "rgba(40, 14, 6, 0.8)",
            color: "#fff",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
            marginBottom: "14px",
          }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#d7ad88",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={() => setShowOnlineOnly((prev) => !prev)}
          />
          Show online only
        </label>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 12px",
        }}
      >
        {filteredUsers.length === 0 ? (
          <div
            style={{
              color: "#ba926d",
              textAlign: "center",
              marginTop: "20px",
              fontSize: "14px",
            }}
          >
            Nema pronađenih korisnika.
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(String(user.id));
            const isSelected = Number(selectedUser?.id) === Number(user.id);

            return (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 12px",
                  marginBottom: "10px",
                  borderRadius: "18px",
                  cursor: "pointer",
                  border: isSelected
                    ? "1px solid #c48752"
                    : "1px solid transparent",
                  background: isSelected
                    ? "rgba(74, 27, 10, 0.9)"
                    : "rgba(38, 13, 6, 0.68)",
                  transition: "0.2s",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "52px",
                    height: "52px",
                    minWidth: "52px",
                  }}
                >
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
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
                    {user.full_name?.charAt(0)}
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: isOnline ? "#76e04b" : "#7b726b",
                      border: "2px solid #1d0b05",
                    }}
                  />
                </div>

                <div
                  style={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      color: "#f8dfc7",
                      fontWeight: "700",
                      fontSize: "16px",
                      marginBottom: "3px",
                    }}
                  >
                    {user.full_name}
                  </div>

                  <div
                    style={{
                      color: isOnline ? "#76e04b" : "#b48f71",
                      fontSize: "13px",
                      marginBottom: "4px",
                    }}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </div>

                  <div
                    style={{
                      color: "#af8969",
                      fontSize: "12px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {getLastMessagePreview(user.id)}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;