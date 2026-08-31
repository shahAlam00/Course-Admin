import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios.js";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", formData);
      const token = response.data.token || response.data.accessToken;
      if (token) {
        localStorage.setItem("token", token);
      }
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50/50 p-4 sm:p-6">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-100 sm:p-10">
        
        {/* Header Branding / Title */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Digicampus Admin</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to manage your academy portal and analytics.</p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm font-medium text-rose-600">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="admin@digicampus.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
            </div>
          </div>

          {/* Password Input Field with Toggle Eye Icon */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-11 pr-12 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:bg-indigo-700 hover:shadow-indigo-600/40 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 disabled:opacity-75 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Footer Subtext */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Authorized administrators only. Secure portal powered by Digicampus.
        </div>

      </div>
    </div>
  );
};

export default Login;