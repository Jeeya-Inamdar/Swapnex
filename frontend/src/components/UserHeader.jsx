import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { MoreHorizontal, Instagram, Link as LinkIcon, BadgeCheck, Loader2, UserPlus, UserMinus } from "lucide-react";
import toast from "react-hot-toast";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast.success("Profile link copied to clipboard!");
    });
  };

  return (
    <div className="glass-card rounded-[2.5rem] border border-slate-800/70 p-8 shadow-card">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white">{user.name || user.username}</h1>
              <BadgeCheck className="h-5 w-5 text-cyan-400" />
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm font-medium text-slate-500">@{user.username}</p>
              <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                swapnex.net
              </span>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-slate-300 max-w-xl">
            {user.bio || "No bio yet."}
          </p>
        </div>

        <div className="shrink-0 self-start">
          <div className="h-28 w-28 overflow-hidden rounded-[2rem] border-2 border-slate-800 bg-slate-900 shadow-xl">
            {user.profilePic ? (
              <img src={user.profilePic} alt={user.username} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-slate-700">
                {user.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/50 pt-6">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">{user.followers.length}</span>
            <span className="text-xs text-slate-500">Followers</span>
          </div>
          <div className="flex items-center gap-2">
            <Instagram className="h-4 w-4 text-slate-500 transition hover:text-white cursor-pointer" />
            <LinkIcon className="h-4 w-4 text-slate-500 transition hover:text-white cursor-pointer" onClick={copyURL} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentUser?._id === user._id ? (
            <RouterLink
              to="/update"
              className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-2 text-xs font-bold text-white transition hover:border-slate-600 hover:bg-slate-800"
            >
              Update Profile
            </RouterLink>
          ) : (
            <button
              onClick={handleFollowUnfollow}
              disabled={updating}
              className={`flex items-center gap-2 rounded-xl px-6 py-2 text-xs font-bold transition-all ${
                following
                  ? "border border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
                  : "bg-white text-slate-950 hover:bg-cyan-50"
              }`}
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
          )}
          <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
