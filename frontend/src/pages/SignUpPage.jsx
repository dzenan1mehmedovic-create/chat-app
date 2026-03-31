import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore.js";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await signup(formData);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Registracija uspješna");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 px-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h1 className="text-center text-3xl font-bold text-primary">
            Sign Up
          </h1>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                value={formData.full_name}
                onChange={(e) =>
                  setFormData({ ...formData, full_name: e.target.value })
                }
                placeholder="Unesi ime i prezime"
              />
            </div>

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
              disabled={isSigningUp}
            >
              {isSigningUp ? "Registracija..." : "Sign Up"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm">
            Već imaš račun?{" "}
            <Link to="/login" className="link link-primary">
              Prijavi se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;