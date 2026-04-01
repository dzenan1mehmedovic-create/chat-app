import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { themes, currentThemeKey } = useThemeStore();
  const [isLoginMode, setIsLoginMode] = useState(true);

  const theme = themes[currentThemeKey];

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: theme.panelBg,
          color: theme.text,
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Učitavanje...
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: {
            background: theme.panelSoft,
            color: theme.text,
            border: `1px solid ${theme.border}`,
            borderRadius: "14px",
            padding: "12px 14px",
            fontWeight: "700",
          },
        }}
      />

      {authUser ? (
        <HomePage />
      ) : isLoginMode ? (
        <LoginPage goToSignup={() => setIsLoginMode(false)} />
      ) : (
        <SignUpPage goToLogin={() => setIsLoginMode(true)} />
      )}
    </>
  );
}

export default App;