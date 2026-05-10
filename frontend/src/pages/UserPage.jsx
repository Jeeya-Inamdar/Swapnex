import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import useGetUserProfile from "../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import postsAtom from "../atoms/postsAtom";
import userAtom from "../atoms/userAtom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import { motion } from "framer-motion";
import { 
  Users, Calendar, Link as LinkIcon, MapPin, 
  Settings, UserPlus, UserMinus, Loader2, MessageCircle
} from "lucide-react";

const tabs = ["Posts", "Replies", "Media", "Likes"];

const UserPage = () => {
  const { user, loading } = useGetUserProfile();
  const { username } = useParams();
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const currentUser = useRecoilValue(userAtom);
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState("Posts");

  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user || {});

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          setPosts([]);
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };
    getPosts();
  }, [username, showToast, setPosts, user]);

  const activityStats = useMemo(
    () => [
      { label: "Followers", value: user?.followers?.length || 0 },
      { label: "Following", value: user?.following?.length || 0 },
      { label: "Posts", value: posts.length },
    ],
    [posts.length, user?.followers?.length, user?.following?.length]
  );

  if (!user && loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent shadow-glow-cyan" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  if (!user && !loading) {
    return (
      <div className="glass-card rounded-[2.5rem] border border-red-500/20 bg-slate-950/90 p-12 text-center shadow-card">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <Users className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Profile not found</h2>
        <p className="mt-2 text-slate-400">The account you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
          Back to Feed
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentUser?._id === user?._id;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <section className="glass-card overflow-hidden rounded-[2.5rem] border border-slate-800/70 shadow-card">
        {/* Banner area */}
        <div className="h-32 bg-gradient-to-r from-slate-900 via-cyan-900/20 to-violet-900/20" />
        
        <div className="relative px-6 pb-8">
          {/* Avatar + Actions row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 mb-6 gap-4">
            <div className="relative inline-block">
              <div className="h-32 w-32 rounded-[2.5rem] border-4 border-slate-950 bg-slate-900 shadow-2xl overflow-hidden">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-slate-700">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isOwnProfile ? (
                <Link
                  to="/update"
                  className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-5 py-2.5 text-sm font-bold text-white transition hover:border-slate-600 hover:bg-slate-800"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleFollowUnfollow}
                    disabled={updating}
                    className={`flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold transition-all ${
                      following
                        ? "border border-slate-700 bg-slate-900/80 text-white hover:bg-slate-800"
                        : "bg-white text-slate-950 hover:bg-cyan-50"
                    }`}
                  >
                    {updating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : following ? (
                      <>
                        <UserMinus className="h-4 w-4" />
                        Unfollow
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Follow
                      </>
                    )}
                  </button>
                  <Link
                    to="/chat"
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900/80 text-white transition hover:border-slate-600 hover:bg-slate-800"
                  >
                    <MessageCircle className="h-5 w-5" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-white">{user.name || user.username}</h1>
                <span className="rounded-full bg-cyan-500/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/20">
                  Verified
                </span>
              </div>
              <p className="text-slate-500 font-medium mt-0.5">@{user.username}</p>
            </div>

            <p className="text-[15px] leading-relaxed text-slate-300 max-w-2xl">
              {user.bio || "Crafting digital experiences and building communities. Passionate about innovation and social connectivity."}
            </p>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <MapPin className="h-3.5 w-3.5" />
                San Francisco, CA
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <LinkIcon className="h-3.5 w-3.5" />
                <a href="#" className="text-cyan-400 hover:underline">swapnex.app</a>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                Joined March 2024
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              {activityStats.map((stat) => (
                <div key={stat.label} className="flex gap-1.5 items-baseline">
                  <span className="text-sm font-bold text-white">{stat.value}</span>
                  <span className="text-xs text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tabs / Filter */}
      <section className="glass-card rounded-[2rem] border border-slate-800/70 shadow-card p-1.5">
        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-[1.5rem] py-2.5 text-xs font-bold transition-all ${
                activeTab === tab 
                  ? "bg-slate-900 text-white shadow-sm ring-1 ring-slate-800" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-900/40"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* Posts Feed */}
      <div className="space-y-6">
        {fetchingPosts ? (
          [1, 2].map((i) => (
            <div key={i} className="glass-card h-64 rounded-[2.5rem] shimmer" />
          ))
        ) : posts.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border border-slate-800/70 p-16 text-center shadow-card">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/50 text-slate-600">
              <Users className="h-8 w-8" />
            </div>
            <p className="text-lg font-bold text-white">No posts yet</p>
            <p className="mt-2 text-sm text-slate-400">When {user.username} shares something, it will appear here.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))
        )}
      </div>
    </div>
  );
};

export default UserPage;
