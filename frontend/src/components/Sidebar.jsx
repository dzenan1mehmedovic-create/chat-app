import { useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";
import { useThemeStore } from "../store/useThemeStore";

const BACKEND_URL = "http://localhost:5001";

const Sidebar = () => {
  const { users, setSelectedUser, selectedUser, unreadCounts } = useChatStore();
  const { onlineUsers } = useSocketStore();
  const { themes, currentThemeKey } = useThemeStore();

  const theme = themes[currentThemeKey];

  const [search, setSearch] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  const getUnreadCount = (userId) => unreadCounts?.[userId] || 0;

  let filteredUsers = [...users];

  if (search.trim()) {
    filteredUsers = filteredUsers.filter((user) =>
      user.full_name.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (showOnlineOnly) {
    filteredUsers = filteredUsers.filter((user) =>
      onlineUsers.includes(String(user.id))
    );
  }

  filteredUsers.sort((a, b) => {
    const aUnread = getUnreadCount(a.id);
    const bUnread = getUnreadCount(b.id);

    if (aUnread > 0 && bUnread === 0) return -1;
    if (aUnread === 0 && bUnread > 0) return 1;

    const aOnline = onlineUsers.includes(String(a.id));
    const bOnline = onlineUsers.includes(String(b.id));

    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    return a.full_name.localeCompare(b.full_name);
  });

  return (
    <div
      style={{
        width: "340px",
        borderRight: `1px solid ${theme.borderSoft}`,
        background: theme.panelBg,
        display: "flex",
        flexDirection: "column",
        minWidth: "340px",
      }}
    >
      <div
        style={{
          padding: "24px 18px 16px 18px",
          borderBottom: `1px solid ${theme.borderSoft}`,
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: "800",
            color: theme.text,
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
            border: `1px solid ${theme.border}`,
            background: theme.inputBg,
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
            color: theme.subtext,
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
              color: theme.muted,
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
            const unreadCount = getUnreadCount(user.id);

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
                    ? `1px solid ${theme.accentStrong}`
                    : unreadCount > 0
                    ? `1px solid ${theme.unreadBorder}`
                    : "1px solid transparent",
                  background: isSelected
                    ? theme.panelSoft
                    : unreadCount > 0
                    ? theme.unreadBg
                    : "rgba(255,255,255,0.03)",
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
                  {user.profile_pic ? (
                    <img
                      src={`${BACKEND_URL}${user.profile_pic}`}
                      alt={user.full_name}
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `2px solid ${theme.accent}`,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        background: theme.accent,
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
                  )}

                  <div
                    style={{
                      position: "absolute",
                      bottom: "2px",
                      right: "2px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: isOnline ? theme.online : theme.offline,
                      border: `2px solid ${theme.pageBg}`,
                    }}
                  />

                  {unreadCount > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        background: theme.danger,
                        color: "#fff",
                        fontSize: "11px",
                        fontWeight: "700",
                        borderRadius: "999px",
                        minWidth: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 6px",
                        boxShadow: `0 0 0 2px ${theme.pageBg}`,
                      }}
                    >
                      {unreadCount}
                    </div>
                  )}
                </div>

                <div
                  style={{
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      color: theme.text,
                      fontWeight: unreadCount > 0 ? "800" : "700",
                      fontSize: "16px",
                      marginBottom: "3px",
                    }}
                  >
                    {user.full_name}
                  </div>

                  <div
                    style={{
                      color: isOnline ? theme.online : theme.muted,
                      fontSize: "13px",
                      marginBottom: "4px",
                    }}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </div>

                  <div
                    style={{
                      color: unreadCount > 0 ? theme.text : theme.muted,
                      fontSize: "12px",
                      fontWeight: unreadCount > 0 ? "700" : "400",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {unreadCount > 0
                      ? `Nova poruka (${unreadCount})`
                      : "Klikni za otvaranje chata"}
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