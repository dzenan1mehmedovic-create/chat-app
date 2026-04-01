import { useMemo, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const BACKEND_URL = "http://localhost:5001";

const ProfileModal = ({ onClose }) => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const { themes, currentThemeKey, setTheme } = useThemeStore();

  const [fullName, setFullName] = useState(authUser?.full_name || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const theme = themes[currentThemeKey];

  const previewUrl = useMemo(() => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }

    if (authUser?.profile_pic) {
      return `${BACKEND_URL}${authUser.profile_pic}`;
    }

    return "";
  }, [selectedFile, authUser?.profile_pic]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleSave = async () => {
    const result = await updateProfile({
      full_name: fullName,
      profile_pic: selectedFile,
    });

    if (!result.success) {
      alert(result.message);
      return;
    }

    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: "460px",
          maxHeight: "90vh",
          overflowY: "auto",
          background: theme.pageBg,
          border: `1px solid ${theme.border}`,
          borderRadius: "22px",
          padding: "24px",
          color: theme.text,
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ margin: 0 }}>Profile Settings</h2>
          <button
            onClick={onClose}
            style={{
              border: "none",
              background: "transparent",
              color: "#fff",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "20px",
            gap: "12px",
          }}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="profile preview"
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                objectFit: "cover",
                border: `3px solid ${theme.accent}`,
              }}
            />
          ) : (
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background: theme.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px",
                fontWeight: "800",
                color: "#fff",
                textTransform: "uppercase",
              }}
            >
              {authUser?.full_name?.charAt(0)}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: "none",
              background: theme.accent,
              color: "#fff",
              borderRadius: "12px",
              padding: "10px 16px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Change Photo
          </button>
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: theme.subtext,
              fontSize: "14px",
            }}
          >
            Full name
          </label>

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "14px",
              border: `1px solid ${theme.border}`,
              background: theme.inputBg,
              color: "#fff",
              outline: "none",
              padding: "0 14px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
        </div>

        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: theme.subtext,
              fontSize: "14px",
            }}
          >
            Email
          </label>

          <input
            type="text"
            value={authUser?.email || ""}
            disabled
            style={{
              width: "100%",
              height: "48px",
              borderRadius: "14px",
              border: `1px solid ${theme.borderSoft}`,
              background: theme.panelSoft,
              color: theme.muted,
              outline: "none",
              padding: "0 14px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <div
            style={{
              marginBottom: "10px",
              color: theme.subtext,
              fontSize: "14px",
            }}
          >
            Chat theme
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {Object.entries(themes).map(([key, item]) => {
              const active = currentThemeKey === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTheme(key)}
                  style={{
                    border: active
                      ? `2px solid ${theme.accentStrong}`
                      : `1px solid ${theme.border}`,
                    background: item.panelBg,
                    color: "#fff",
                    borderRadius: "14px",
                    padding: "12px",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      fontWeight: "700",
                      marginBottom: "8px",
                    }}
                  >
                    {item.name}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: item.accent,
                      }}
                    />
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: item.incoming,
                      }}
                    />
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        background: item.outgoing,
                      }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              border: `1px solid ${theme.border}`,
              background: "transparent",
              color: theme.text,
              borderRadius: "12px",
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={isUpdatingProfile}
            style={{
              border: "none",
              background: theme.accent,
              color: "#fff",
              borderRadius: "12px",
              padding: "10px 16px",
              cursor: "pointer",
              fontWeight: "700",
            }}
          >
            {isUpdatingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;