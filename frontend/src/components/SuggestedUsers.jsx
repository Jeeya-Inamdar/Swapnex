import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";
import { Sparkles, Users } from "lucide-react";

const SuggestedUsers = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const showToast = useShowToast();

  useEffect(() => {
    const getSuggestedUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/users/suggested");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setSuggestedUsers(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getSuggestedUsers();
  }, [showToast]);

  return (
    <div className="glass-card overflow-hidden rounded-[2.5rem] border border-slate-800/70 shadow-card">
      <div className="border-b border-slate-800/50 bg-slate-900/30 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-white">Suggestions</h2>
            <p className="text-[11px] font-medium text-slate-500">People you may want to connect with</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-800/50 px-2 py-2">
        {loading &&
          [1, 2, 3, 4].map((id) => (
            <div key={id} className="flex items-center gap-4 px-4 py-4">
              <div className="h-12 w-12 shrink-0 rounded-2xl shimmer" />
              <div className="flex-1 space-y-2.5">
                <div className="h-3 w-28 rounded-full shimmer" />
                <div className="h-2 w-20 rounded-full shimmer opacity-60" />
              </div>
              <div className="h-9 w-20 rounded-xl shimmer" />
            </div>
          ))}

        {!loading && suggestedUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Users className="mb-3 h-10 w-10 text-slate-700" />
            <p className="text-xs font-medium text-slate-500">No suggestions available yet</p>
          </div>
        )}

        {!loading &&
          suggestedUsers.map((user) => <SuggestedUser key={user._id} user={user} />)}
      </div>
      
      {!loading && suggestedUsers.length > 0 && (
        <button className="w-full bg-slate-900/40 py-3.5 text-xs font-bold text-slate-400 transition hover:bg-slate-900/60 hover:text-white">
          Show More
        </button>
      )}
    </div>
  );
};

export default SuggestedUsers;
