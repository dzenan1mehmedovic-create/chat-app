import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Uspješna prijava");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 px-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="text-center text-3xl font-bold text-primary">Login</h1>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Unesi email"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Unesi password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Prijava..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Nemaš račun?{" "}
            <Link to="/signup" className="link link-primary">
              Registruj se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;