import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";
import useShowToast from "../hooks/useShowToast";
import { useSetRecoilState } from "recoil";
import createPostModalAtom from "../atoms/createPostModalAtom";

const filterOptions = [
  { key: "latest", label: "Latest" },
  { key: "following", label: "Following" },
  { key: "trending", label: "Trending" },
  { key: "media", label: "Media" },
];

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [activeFilter, setActiveFilter] = useState("latest");
  const showToast = useShowToast();
  const setOpen = useSetRecoilState(createPostModalAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ["feed", activeFilter],
    queryFn: async () => {
      const response = await fetch("/api/posts/feed");
      const json = await response.json();
      if (json.error) throw new Error(json.error);
      return json;
    },
    placeholderData: (previousData) => previousData,
  });

  useEffect(() => {
    if (data) setPosts(data);
  }, [data, setPosts]);

  useEffect(() => {
    if (error) showToast("Unable to load feed", error.message, "error");
  }, [error, showToast]);

  const filteredPosts = useMemo(() => {
    if (!data) return [];
    if (activeFilter === "media") return data.filter((post) => post.img);
    if (activeFilter === "trending") return [...data].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
    return data;
  }, [data, activeFilter]);

  const trendingTopics = [
    { title: "AI Launch", description: "Creators sharing latest tools." },
    { title: "Design Systems", description: "Polished UI patterns rising fast." },
    { title: "Network Momentum", description: "Signals from active conversations." },
  ];

  return (
    <div className="space-y-6">
      <section className="glass-card rounded-[2rem] border border-slate-800/70 p-6 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Home</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Feed</h1>
            <p className="mt-2 max-w-2xl text-slate-400">A modern, filtered home stream with trending moments, media previews, and realtime reactions.</p>
          </div>
          <button 
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
          >
            Create a post
          </button>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {filterOptions.map((option) => (
            <button
              key={option.key}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                option.key === activeFilter
                  ? "border-cyan-300 bg-cyan-500/10 text-cyan-200"
                  : "border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-600 hover:bg-slate-900"
              }`}
              onClick={() => setActiveFilter(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="space-y-6">
          {isLoading && (
            <div className="space-y-5">
              {[1, 2, 3].map((loadingId) => (
                <div key={loadingId} className="animate-pulse rounded-[2rem] border border-slate-800/70 bg-slate-900/80 p-6">
                  <div className="h-5 w-56 rounded-full bg-slate-700" />
                  <div className="mt-4 h-4 w-40 rounded-full bg-slate-700" />
                  <div className="mt-6 h-52 rounded-3xl bg-slate-800" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredPosts.length === 0 && (
            <div className="glass-card rounded-[2rem] border border-slate-800/70 p-10 text-center text-slate-300 shadow-card">
              <p className="text-xl font-semibold text-white">Nothing to show here yet</p>
              <p className="mt-3 max-w-xl mx-auto text-slate-400">Follow creators and start posting to build a personalized dashboard of stories and designs.</p>
            </div>
          )}

          {filteredPosts.map((post) => (
            <motion.div key={post._id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Post post={post} postedBy={post.postedBy} />
            </motion.div>
          ))}
        </article>

        <aside className="space-y-6">
          <div className="glass-card rounded-[2rem] border border-slate-800/70 p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Trending</p>
                <h2 className="mt-3 text-xl font-semibold text-white">Discover moments</h2>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.24em] text-cyan-300">Live</span>
            </div>
            <div className="mt-6 space-y-3">
              {trendingTopics.map((item) => (
                <div key={item.title} className="rounded-3xl border border-slate-800/70 bg-slate-900/80 p-4 transition hover:border-cyan-400/40 hover:bg-slate-900">
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <SuggestedUsers />
        </aside>
      </div>
    </div>
  );
};

export default HomePage;
