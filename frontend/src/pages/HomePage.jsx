import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser, getUsers } = useChatStore();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />

      {selectedUser ? (
        <ChatContainer />
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h2>Odaberi korisnika za chat</h2>
        </div>
      )}
    </div>
  );
};

export default HomePage;