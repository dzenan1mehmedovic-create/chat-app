import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import ProfileModal from "../components/ProfileModal";

const BACKEND_URL = "http://localhost:5001";

const HomePage = () => {
  const { selectedUser, getUsers } = useChatStore();
  const { logout, authUser } = useAuthStore();
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #170804 0%, #1a0904 35%, #120603 100%)",
        color: "#f7d7b8",
        padding: "18px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          maxWidth: "1450px",
          margin: "0 auto",
          height: "calc(100vh - 36px)",
          border: "1px solid rgba(196, 133, 82, 0.35)",
          borderRadius: "22px",
          overflow: "hidden",
          background: "rgba(20, 7, 3, 0.96)",
          boxShadow: "0 10px 40px rgba(0,0,0,0.35)",
          display: "flex",
        }}
      >
        <Sidebar />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <div
            style={{
              height: "76px",
              borderBottom: "1px solid rgba(196, 133, 82, 0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 22px",
              background: "rgba(32, 12, 6, 0.7)",
            }}
          >
            <div
              style={{
                fontSize: "24px",
                fontWeight: "800",
                letterSpacing: "0.2px",
                color: "#f8dfc7",
              }}
            >
              Chatty
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setShowProfileModal(true)}
                style={{
                  border: "1px solid rgba(196, 133, 82, 0.35)",
                  background: "rgba(39, 13, 6, 0.9)",
                  color: "#fff",
                  borderRadius: "14px",
                  padding: "10px 16px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Profile
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {authUser?.profile_pic ? (
                  <img
                    src={`${BACKEND_URL}${authUser.profile_pic}`}
                    alt="me"
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #b57a4d",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "#b57a4d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "800",
                      textTransform: "uppercase",
                    }}
                  >
                    {authUser?.full_name?.charAt(0)}
                  </div>
                )}

                <div
                  style={{
                    color: "#f3cfab",
                    fontWeight: "600",
                    fontSize: "15px",
                  }}
                >
                  {authUser?.full_name}
                </div>
              </div>

              <button
                onClick={logout}
                style={{
                  border: "none",
                  background: "#b57a4d",
                  color: "#fff",
                  fontWeight: "700",
                  borderRadius: "14px",
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                Logout
              </button>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: "flex",
            }}
          >
            {selectedUser ? (
              <ChatContainer />
            ) : (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#efcba8",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "86px",
                    height: "86px",
                    borderRadius: "50%",
                    background: "rgba(181, 122, 77, 0.16)",
                    border: "1px solid rgba(196, 133, 82, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "34px",
                  }}
                >
                  💬
                </div>

                <h2
                  style={{
                    margin: 0,
                    fontSize: "34px",
                    fontWeight: "800",
                    color: "#f7dbbf",
                  }}
                >
                  Welcome to Chatty
                </h2>

                <p
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    color: "#d7ad88",
                  }}
                >
                  Odaberi korisnika iz sidebara i započni razgovor.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </div>
  );
};

export default HomePage;