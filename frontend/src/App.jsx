import { useEffect, useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isLoginMode, setIsLoginMode] = useState(true);

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
          backgroundColor: "#140904",
          color: "#f5d2b3",
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