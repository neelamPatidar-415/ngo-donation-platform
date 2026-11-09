
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/donor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F3] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-stone-200 p-8 space-y-5"
      >
        <div>
          <p className="text-sm text-emerald-700 font-semibold">WELCOME BACK</p>
          <h1 className="text-3xl font-bold text-stone-900 mt-2">
            Login to your account
          </h1>
          <p className="text-stone-500 mt-2">
            Continue making a difference.
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            autoComplete="email"
            className="w-full border border-stone-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            autoComplete="current-password"
            className="w-full border border-stone-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="Enter your password"
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white font-semibold rounded-lg p-3"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-stone-600">
          New here?{" "}
          <Link to="/register" className="text-emerald-800 font-semibold">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
