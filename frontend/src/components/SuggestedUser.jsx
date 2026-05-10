import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { UserPlus, UserMinus, Loader2 } from "lucide-react";

const SuggestedUser = ({ user }) => {
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  return (
    <div className="group flex items-center justify-between rounded-[2rem] px-4 py-4 transition-all hover:bg-slate-900/60">
      <Link to={`/${user.username}`} className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-sm transition group-hover:border-cyan-400/40">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
            {user.username}
          </p>
          <p className="truncate text-[11px] font-medium text-slate-500">{user.name}</p>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleFollowUnfollow}
        disabled={updating}
        className={`flex h-9 items-center justify-center gap-2 rounded-xl px-4 text-xs font-bold transition-all ${
          following
            ? "border border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800"
            : "bg-white text-slate-950 hover:bg-cyan-50 shadow-lg shadow-white/5"
        } ${updating ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        {updating ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : following ? (
          <>
            <UserMinus className="h-3.5 w-3.5" />
            Unfollow
          </>
        ) : (
          <>
            <UserPlus className="h-3.5 w-3.5" />
            Follow
          </>
        )}
      </button>
    </div>
  );
};

export default SuggestedUser;
