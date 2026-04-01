import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatContainer from "../components/ChatContainer";
import ProfileModal from "../components/ProfileModal";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const BACKEND_URL = "http://localhost:5001";

const HomePage = () => {
  const { selectedUser, getUsers } = useChatStore();
  const { authUser, logout } = useAuthStore();
  const { themes, currentThemeKey } = useThemeStore();

  const theme = themes[currentThemeKey];
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background: theme.pageBg,
        color: theme.text,
        padding: "8px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
          borderRadius: "24px",
          border: `1px solid ${theme.borderSoft}`,
          background: theme.pageBg,
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
              height: "84px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              borderBottom: `1px solid ${theme.borderSoft}`,
              background: theme.panelSoft,
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                fontWeight: "800",
                color: theme.text,
              }}
            >
              Chatty
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <button
                onClick={() => setShowProfile(true)}
                style={{
                  border: `1px solid ${theme.border}`,
                  background: "transparent",
                  color: theme.text,
                  borderRadius: "16px",
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "16px",
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
                    alt={authUser.full_name}
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `2px solid ${theme.accent}`,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: theme.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontWeight: "800",
                      fontSize: "18px",
                      textTransform: "uppercase",
                    }}
                  >
                    {authUser?.full_name?.charAt(0)}
                  </div>
                )}

                <div
                  style={{
                    color: theme.text,
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  {authUser?.full_name}
                </div>
              </div>

              <button
                onClick={logout}
                style={{
                  border: "none",
                  background: theme.accent,
                  color: "#fff",
                  borderRadius: "16px",
                  padding: "12px 18px",
                  cursor: "pointer",
                  fontWeight: "800",
                  fontSize: "16px",
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
                  alignItems: "center",
                  justifyContent: "center",
                  background: theme.panelBg,
                  padding: "24px",
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      width: "88px",
                      height: "88px",
                      margin: "0 auto 22px auto",
                      borderRadius: "50%",
                      background: theme.panelSoft,
                      border: `1px solid ${theme.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "40px",
                    }}
                  >
                    💬
                  </div>

                  <h1
                    style={{
                      fontSize: "32px",
                      margin: "0 0 12px 0",
                      fontWeight: "800",
                      color: theme.text,
                    }}
                  >
                    Welcome to Chatty
                  </h1>

                  <p
                    style={{
                      margin: 0,
                      color: theme.subtext,
                      fontSize: "16px",
                    }}
                  >
                    Odaberi korisnika iz sidebara i započni razgovor.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
    </div>
  );
};

export default HomePage;