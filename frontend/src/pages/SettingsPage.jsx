import { motion } from "framer-motion";
import { useState } from "react";
import {
  Settings, Shield, BellRing, Snowflake, LogOut, ChevronRight,
  Moon, Globe, Lock, Trash2, Loader2,
} from "lucide-react";
import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";
import { Link } from "react-router-dom";

export const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();
  const [freezing, setFreezing] = useState(false);

  const freezeAccount = async () => {
    if (!window.confirm("Are you sure you want to freeze your account? You can unfreeze it by logging in again.")) return;
    setFreezing(true);
    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (data.success) {
        await logout();
        showToast("Account frozen", "Your account has been frozen. Log in to restore it.", "success");
      }
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setFreezing(false);
    }
  };

  const sections = [
    {
      title: "Account",
      icon: Settings,
      items: [
        { label: "Edit profile",        desc: "Update your name, bio, and avatar",      icon: Settings,    href: "/update" },
        { label: "Privacy",             desc: "Control who can see your content",       icon: Globe,       href: "#" },
        { label: "Notifications",       desc: "Manage push and email notifications",    icon: BellRing,    href: "#" },
      ],
    },
    {
      title: "Security",
      icon: Shield,
      items: [
        { label: "Change password",     desc: "Update your account password",           icon: Lock,        href: "/update" },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl space-y-6"
    >
      {/* Header */}
      <div className="glass-card rounded-[2rem] border border-slate-800/70 p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
            <Settings className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
            <p className="text-sm text-slate-400">Manage your account and preferences</p>
          </div>
        </div>
      </div>

      {/* Settings sections */}
      {sections.map((section, si) => (
        <div key={si} className="glass-card rounded-[2rem] border border-slate-800/70 shadow-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-800/70 px-6 py-4">
            <section.icon className="h-4 w-4 text-slate-400" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{section.title}</p>
          </div>
          <div className="divide-y divide-slate-800/60">
            {section.items.map((item, ii) => (
              <Link
                key={ii}
                to={item.href}
                className="flex items-center justify-between px-6 py-4 transition hover:bg-slate-900/60"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-slate-400">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </Link>
            ))}
          </div>
        </div>
      ))}

      {/* Danger zone */}
      <div className="glass-card rounded-[2rem] border border-red-500/20 shadow-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-red-500/20 px-6 py-4">
          <Shield className="h-4 w-4 text-red-400" />
          <p className="text-xs font-semibold uppercase tracking-wider text-red-400">Danger Zone</p>
        </div>
        <div className="divide-y divide-slate-800/60">
          {/* Freeze account */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-amber-400">
                <Snowflake className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Freeze account</p>
                <p className="text-xs text-slate-400">Temporarily hide your profile and posts</p>
              </div>
            </div>
            <button
              id="freeze-account-btn"
              type="button"
              onClick={freezeAccount}
              disabled={freezing}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/20 disabled:opacity-60"
            >
              {freezing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Snowflake className="h-3.5 w-3.5" />}
              {freezing ? "Freezing..." : "Freeze"}
            </button>
          </div>

          {/* Log out */}
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/80 text-red-400">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-white">Sign out</p>
                <p className="text-xs text-slate-400">Sign out of your Swapnex account</p>
              </div>
            </div>
            <button
              id="settings-logout-btn"
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <p className="pb-6 text-center text-xs text-slate-600">Swapnex · Realtime Social Platform</p>
    </motion.div>
  );
};
