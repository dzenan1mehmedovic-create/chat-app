import { useMemo, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const BACKEND_URL = "http://localhost:5001";

const ProfileModal = ({ onClose }) => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();

  const [fullName, setFullName] = useState(authUser?.full_name || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

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
          width: "420px",
          background: "#1b0a05",
          border: "1px solid rgba(196, 133, 82, 0.35)",
          borderRadius: "22px",
          padding: "24px",
          color: "#f8dfc7",
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
                border: "3px solid #b57a4d",
              }}
            />
          ) : (
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background: "#b57a4d",
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
              background: "#b57a4d",
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
              color: "#ddb38e",
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
              border: "1px solid rgba(196, 133, 82, 0.35)",
              background: "rgba(39, 13, 6, 0.9)",
              color: "#fff",
              outline: "none",
              padding: "0 14px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
        </div>

        <div style={{ marginBottom: "22px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              color: "#ddb38e",
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
              border: "1px solid rgba(196, 133, 82, 0.2)",
              background: "rgba(26, 10, 5, 0.75)",
              color: "#caa785",
              outline: "none",
              padding: "0 14px",
              boxSizing: "border-box",
              fontSize: "15px",
            }}
          />
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
              border: "1px solid rgba(196, 133, 82, 0.35)",
              background: "transparent",
              color: "#f7d7b8",
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
              background: "#b57a4d",
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