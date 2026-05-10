import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { MoreHorizontal, Trash2, BadgeCheck, Clock } from "lucide-react";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${postedBy}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };
    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) return (
    <div className="glass-card rounded-[2.5rem] p-6 shadow-card h-[200px] shimmer" />
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="group glass-card overflow-hidden rounded-[2.5rem] border border-slate-800/70 shadow-card transition-all hover:border-cyan-400/20"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Link
            to={`/${user.username}`}
            className="relative shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-14 w-14 overflow-hidden rounded-[1.25rem] border border-slate-800/80 bg-slate-950 shadow-inner group-hover:border-cyan-400/40 transition-colors">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.username} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-500">
                  {user.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </Link>

          {/* Content Area */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <Link
                  to={`/${user.username}`}
                  className="truncate text-base font-bold text-white hover:text-cyan-300 transition-colors"
                >
                  {user.username}
                </Link>
                <BadgeCheck className="h-4 w-4 shrink-0 text-cyan-400" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-900/50 px-2.5 py-1 rounded-full">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(post.createdAt))} ago
                </div>
                {currentUser?._id === user._id && (
                  <button
                    onClick={handleDeletePost}
                    disabled={isDeleting}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            <Link to={`/${user.username}/post/${post._id}`} className="block mt-3">
              <p className="text-[15px] leading-relaxed text-slate-200 group-hover:text-white transition-colors">
                {post.text}
              </p>
            </Link>

            {post.img && (
              <Link to={`/${user.username}/post/${post._id}`} className="mt-4 block overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-950">
                <img
                  src={post.img}
                  alt="post media"
                  className="max-h-[500px] w-full object-cover transition duration-500 group-hover:scale-[1.01]"
                />
              </Link>
            )}

            <div className="mt-6">
              <Actions post={post} postedBy={user.username} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Post;
