import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { 
  ChevronLeft, MessageSquare, Trash2, Clock, 
  BadgeCheck, Share, MoreHorizontal 
} from "lucide-react";
import { motion } from "framer-motion";

const PostPage = () => {
  const { user, loading } = useGetUserProfile();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const navigate = useNavigate();
  const [loadingPost, setLoadingPost] = useState(true);

  const currentPost = posts[0];

  useEffect(() => {
    const getPost = async () => {
      setLoadingPost(true);
      setPosts([]);
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts([data]);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingPost(false);
      }
    };
    getPost();
  }, [showToast, pid, setPosts]);

  const handleDeletePost = async () => {
    if (!currentPost) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  if ((!user && loading) || loadingPost) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-cyan-400 border-t-transparent shadow-glow-cyan" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">Loading post...</p>
      </div>
    );
  }

  if (!currentPost) {
    return (
      <div className="glass-card rounded-[2.5rem] border border-slate-800/70 bg-slate-950/90 p-12 text-center shadow-card">
        <h2 className="text-2xl font-bold text-white">Post not found</h2>
        <p className="mt-2 text-slate-400">This post might have been removed or the link is invalid.</p>
        <button onClick={() => navigate(-1)} className="mt-8 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-white transition-colors group"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 group-hover:bg-slate-800 transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </div>
        Back
      </button>

      {/* Main Post Card */}
      <div className="glass-card overflow-hidden rounded-[2.5rem] border border-slate-800/70 shadow-card">
        <div className="p-8">
          <div className="flex items-center justify-between gap-4">
            <Link to={`/${user.username}`} className="flex items-center gap-4 group">
              <div className="h-14 w-14 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950 group-hover:border-cyan-400/40 transition-colors">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-slate-500">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">{user.username}</p>
                  <BadgeCheck className="h-4 w-4 text-cyan-400" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(currentPost.createdAt))} ago
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-slate-400 hover:text-white transition-colors">
                <MoreHorizontal className="h-5 w-5" />
              </button>
              {currentUser?._id === user._id && (
                <button
                  onClick={handleDeletePost}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <p className="text-[17px] leading-relaxed text-slate-100 font-medium">
              {currentPost.text}
            </p>
            
            {currentPost.img && (
              <div className="overflow-hidden rounded-3xl border border-slate-800/50 bg-slate-950">
                <img src={currentPost.img} alt="Post media" className="h-full w-full object-cover" />
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-800/50">
            <Actions post={currentPost} />
          </div>
        </div>
      </div>

      {/* Engagement Card */}
      {/* <div className="glass-card rounded-[2.5rem] border border-slate-800/70 p-6 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Discussion</h2>
              <p className="text-xs font-medium text-slate-500">View and reply to comments on this post.</p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800">
            <Share className="h-4 w-4" />
            Share
          </button>
        </div>
      </div> */}

      {/* Comments List */}
      <div className="space-y-4 pb-12">
        {currentPost.replies.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border border-slate-800/70 p-12 text-center text-slate-500 shadow-card">
            <p className="text-sm font-medium">No replies yet. Be the first to join the discussion!</p>
          </div>
        ) : (
          currentPost.replies.map((reply) => (
            <Comment 
              key={reply._id} 
              reply={reply} 
              lastReply={reply._id === currentPost.replies[currentPost.replies.length - 1]._id} 
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default PostPage;
