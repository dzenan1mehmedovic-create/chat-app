import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LoginPage = ({ goToSignup }) => {
  const { login, isLoggingIn } = useAuthStore();

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
        backgroundColor: "#140904",
        color: "#f5d2b3",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "360px",
          padding: "28px",
          borderRadius: "16px",
          backgroundColor: "#1b0c05",
          border: "1px solid #8b5e3c",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #8b5e3c",
            backgroundColor: "#140904",
            color: "#fff",
            outline: "none",
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
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #8b5e3c",
            backgroundColor: "#140904",
            color: "#fff",
            outline: "none",
          }}
        />

        <button
          type="submit"
          disabled={isLoggingIn}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#8b5e3c",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {isLoggingIn ? "Prijava..." : "Login"}
        </button>

        <p style={{ textAlign: "center", margin: 0 }}>
          Nemaš račun?{" "}
          <button
            type="button"
            onClick={goToSignup}
            style={{
              background: "none",
              border: "none",
              color: "#d9a679",
              cursor: "pointer",
              fontWeight: "bold",
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