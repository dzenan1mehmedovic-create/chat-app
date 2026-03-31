import { useAuthStore } from "../store/useAuthStore.js";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="navbar border-b border-base-300 bg-base-200 px-6">
        <div className="flex-1">
          <a className="text-2xl font-bold text-primary">Chatty</a>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-medium">{authUser?.full_name}</span>
          <button className="btn btn-primary btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-65px)] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 text-4xl font-bold text-primary">
            Welcome to Chatty
          </h1>
          <p className="text-base-content/70">
            Auth radi i spremni smo za dalje.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;