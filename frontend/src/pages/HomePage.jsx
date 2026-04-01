import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, getUsers } = useChatStore();
  const { logout, authUser } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#140904",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            color: "#f5d2b3",
            fontWeight: "600",
          }}
        >
          {authUser?.full_name}
        </span>

        <button
          onClick={logout}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            background: "#8b5e3c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      <Sidebar />

      {selectedUser ? (
        <ChatContainer />
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#f5d2b3",
            fontSize: "22px",
          }}
        >
          Odaberi korisnika za chat
        </div>
      )}
    </div>
  );
};

export default HomePage;