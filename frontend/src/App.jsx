import { useEffect, useState } from "react";
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

  if (authUser) {
    return <HomePage />;
  }

  return isLoginMode ? (
    <LoginPage goToSignup={() => setIsLoginMode(false)} />
  ) : (
    <SignUpPage goToLogin={() => setIsLoginMode(true)} />
  );
}

export default App;