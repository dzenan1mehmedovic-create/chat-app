import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const SignUpPage = ({ goToLogin }) => {
  const { signup, isSigningUp } = useAuthStore();
  const { themes, currentThemeKey } = useThemeStore();

  const theme = themes[currentThemeKey];

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signup(formData);

    if (!result.success) {
      alert(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.panelBg,
        color: theme.text,
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "400px",
          padding: "30px",
          borderRadius: "22px",
          background: theme.panelSoft,
          border: `1px solid ${theme.border}`,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            color: theme.text,
            fontSize: "30px",
            fontWeight: "800",
          }}
        >
          Sign Up
        </h2>

        <p
          style={{
            margin: "0 0 10px 0",
            textAlign: "center",
            color: theme.subtext,
            fontSize: "14px",
          }}
        >
          Napravi svoj Chatty račun
        </p>

        <input
          type="text"
          placeholder="Full name"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: `1px solid ${theme.border}`,
            background: theme.inputBg,
            color: "#fff",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: `1px solid ${theme.border}`,
            background: theme.inputBg,
            color: "#fff",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: `1px solid ${theme.border}`,
            background: theme.inputBg,
            color: "#fff",
            outline: "none",
            fontSize: "15px",
          }}
        />

        <button
          type="submit"
          disabled={isSigningUp}
          style={{
            padding: "14px",
            borderRadius: "14px",
            border: "none",
            background: theme.accent,
            color: "#fff",
            fontWeight: "800",
            fontSize: "15px",
            cursor: "pointer",
          }}
        >
          {isSigningUp ? "Registracija..." : "Sign Up"}
        </button>

        <p
          style={{
            textAlign: "center",
            margin: "6px 0 0 0",
            color: theme.subtext,
          }}
        >
          Već imaš račun?{" "}
          <button
            type="button"
            onClick={goToLogin}
            style={{
              background: "none",
              border: "none",
              color: theme.accentStrong,
              cursor: "pointer",
              fontWeight: "800",
              fontSize: "14px",
            }}
          >
            Prijavi se
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;