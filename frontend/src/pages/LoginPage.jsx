import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const LoginPage = ({ goToSignup }) => {
  const { login, isLoggingIn } = useAuthStore();
  const { themes, currentThemeKey } = useThemeStore();

  const theme = themes[currentThemeKey];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

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
          width: "380px",
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
          Login
        </h2>

        <p
          style={{
            margin: "0 0 10px 0",
            textAlign: "center",
            color: theme.subtext,
            fontSize: "14px",
          }}
        >
          Dobrodošao nazad u Chatty
        </p>

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
          disabled={isLoggingIn}
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
          {isLoggingIn ? "Prijava..." : "Login"}
        </button>

        <p
          style={{
            textAlign: "center",
            margin: "6px 0 0 0",
            color: theme.subtext,
          }}
        >
          Nemaš račun?{" "}
          <button
            type="button"
            onClick={goToSignup}
            style={{
              background: "none",
              border: "none",
              color: theme.accentStrong,
              cursor: "pointer",
              fontWeight: "800",
              fontSize: "14px",
            }}
          >
            Registruj se
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;