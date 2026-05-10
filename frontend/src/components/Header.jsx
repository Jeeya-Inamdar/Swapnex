import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import {
  MessageCircle,
  Settings,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import userAtom from "../atoms/userAtom";
import useLogout from "../hooks/useLogout";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const user = useRecoilValue(userAtom);
  const logout = useLogout();

  const [profileOpen, setProfileOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState("/dark-logo.svg");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const setThemeLogo = () =>
      setLogoSrc(mediaQuery.matches ? "/light-logo.svg" : "/dark-logo.svg");

    setThemeLogo();

    mediaQuery.addEventListener("change", setThemeLogo);

    return () => mediaQuery.removeEventListener("change", setThemeLogo);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <div className="relative flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Spacer */}
        <div className="w-10 md:w-32" />

        {/* Center Logo */}
        <Link
          to="/"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 group"
        >
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
            src={logoSrc}
            alt="Swapnex"
            className="h-10 w-10 rounded-2xl bg-slate-950 p-2 shadow-lg shadow-cyan-500/20 object-contain"
          />

          <div>
            <p className="text-base font-bold tracking-tight text-white">
              Swapnex
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              {/* Chat */}
              <Link
                to="/chat"
                className="hidden md:flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/70 bg-slate-900/50 text-slate-400 transition-all duration-200 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>

              {/* Profile Dropdown */}
              <div className="relative ml-2">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-1 pr-3 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80"
                >
                  <div className="h-8 w-8 overflow-hidden rounded-xl border border-slate-700/50">
                    {user.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.username}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs font-bold text-slate-400">
                        {user.username?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-3 w-56 overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl"
                    >
                      {/* Profile */}
                      <Link
                        to={`/${user.username}`}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-slate-900"
                      >
                        <User className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-medium text-slate-200">
                          Profile
                        </span>
                      </Link>

                      {/* Settings */}
                      <Link
                        to="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-slate-900"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-medium text-slate-200">
                          Settings
                        </span>
                      </Link>

                      {/* Divider */}
                      <div className="mx-2 my-1 border-t border-slate-800/60" />

                      {/* Logout */}
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl p-3 text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />

                        <span className="text-sm font-medium">
                          Logout
                        </span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-6 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/25 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;