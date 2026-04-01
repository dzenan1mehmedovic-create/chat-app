import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../store/useSocketStore";

const Sidebar = () => {
  const { users, setSelectedUser, selectedUser } = useChatStore();
  const { onlineUsers } = useSocketStore();

  return (
    <div
      style={{
        width: "280px",
        borderRight: "1px solid #8b5e3c",
        padding: "12px 10px",
        backgroundColor: "#140904",
        color: "#f5d2b3",
        overflowY: "auto",
      }}
    >
      <h3
        style={{
          marginBottom: "14px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Korisnici
      </h3>

      {users.length === 0 ? (
        <p style={{ color: "#caa07d" }}>Nema korisnika.</p>
      ) : (
        users.map((user) => {
          const isOnline = onlineUsers.includes(String(user.id));
          const isSelected = selectedUser?.id === user.id;

          return (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 10px",
                marginBottom: "8px",
                cursor: "pointer",
                borderRadius: "12px",
                backgroundColor: isSelected ? "#2a1208" : "#1b0c05",
                border: isSelected
                  ? "1px solid #b67a4f"
                  : "1px solid transparent",
                transition: "0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    backgroundColor: "#8b5e3c",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "16px",
                    textTransform: "uppercase",
                  }}
                >
                  {user.full_name?.charAt(0)}
                </div>

                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "#f5d2b3",
                    }}
                  >
                    {user.full_name}
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: isOnline ? "#73d13d" : "#a38b78",
                    }}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: isOnline ? "#73d13d" : "#666",
                }}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default Sidebar;