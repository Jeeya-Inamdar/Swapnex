import { NavLink } from "react-router-dom";
import { Home, MessageCircle, User } from "lucide-react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const MobileNav = () => {
  const user = useRecoilValue(userAtom);

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-800/70 bg-slate-950/80 px-4 py-3 backdrop-blur-xl lg:hidden">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`
        }
      >
        <Home className="h-6 w-6" />
        <span className="text-[10px] font-medium">Home</span>
      </NavLink>

      <NavLink
        to="/chat"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`
        }
      >
        <MessageCircle className="h-6 w-6" />
        <span className="text-[10px] font-medium">Chat</span>
      </NavLink>

      <NavLink
        to={`/${user.username}`}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 transition-colors ${
            isActive ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
          }`
        }
      >
        <User className="h-6 w-6" />
        <span className="text-[10px] font-medium">Profile</span>
      </NavLink>
    </nav>
  );
};

export default MobileNav;
