import { motion } from "framer-motion";
import { useState } from "react";
import { Eye, EyeOff, Lock, User, Loader2 } from "lucide-react";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const setUser = useSetRecoilState(userAtom);
  const [loading, setLoading] = useState(false);
  const [inputs, setInputs] = useState({ username: "", password: "" });
  const showToast = useShowToast();

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!inputs.username || !inputs.password) {
      showToast("Missing fields", "Please fill in all fields.", "error");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Login failed", data.error, "error");
        return;
      }
      localStorage.setItem("user-threads", JSON.stringify(data));
      setUser(data);
    } catch (error) {
      showToast("Error", error.message || String(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md"
    >
      {/* Logo + heading */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/30">
          <span className="text-2xl font-black text-slate-950">S</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-400">Sign in to your Swapnex account</p>
      </div>

      {/* Form card */}
      <div className="glass-card rounded-3xl border border-slate-800/70 p-8 shadow-card">
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="login-username"
                type="text"
                placeholder="yourhandle"
                value={inputs.username}
                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/80 py-3 pl-10 pr-4 text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/80 py-3 pl-10 pr-12 text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800/70" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-slate-950/90 px-3 text-slate-500">New to Swapnex?</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAuthScreen("signup")}
          className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/70 py-3 text-sm font-semibold text-slate-200 transition-all duration-200 hover:border-cyan-400/40 hover:bg-slate-800/80 hover:text-white"
        >
          Create an account
        </button>
      </div>
    </motion.div>
  );
}
