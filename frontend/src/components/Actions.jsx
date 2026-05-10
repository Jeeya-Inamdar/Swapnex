import { useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { Heart, MessageCircle, Share2, Eye, Loader2, Send } from "lucide-react";
import Modal from "./Modal";
import { motion } from "framer-motion";

const Actions = ({ post, postedBy }) => {
  const user = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [isLiking, setIsLiking] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showToast = useShowToast();

  const handleLikeAndUnlike = async (e) => {
    e?.preventDefault();
    if (!user) return showToast("Error", "You must be logged in to like a post", "error");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/posts/like/" + post._id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      if (!liked) {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: [...p.likes, user._id] };
          }
          return p;
        });
        setPosts(updatedPosts);
      } else {
        const updatedPosts = posts.map((p) => {
          if (p._id === post._id) {
            return { ...p, likes: p.likes.filter((id) => id !== user._id) };
          }
          return p;
        });
        setPosts(updatedPosts);
      }
      setLiked(!liked);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleReply = async (e) => {
    e?.preventDefault();
    if (!user) return showToast("Error", "You must be logged in to reply to a post", "error");
    if (isReplying) return;
    if (!reply.trim()) return;

    setIsReplying(true);
    try {
      const res = await fetch("/api/posts/reply/" + post._id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: reply }),
      });
      const data = await res.json();
      if (data.error) return showToast("Error", data.error, "error");

      const updatedPosts = posts.map((p) => {
        if (p._id === post._id) {
          return { ...p, replies: [...p.replies, data] };
        }
        return p;
      });
      setPosts(updatedPosts);
      showToast("Success", "Reply posted successfully", "success");
      setIsModalOpen(false);
      setReply("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleLikeAndUnlike}
          className={`group flex items-center gap-1.5 transition-colors ${
            liked ? "text-rose-500" : "text-slate-500 hover:text-rose-400"
          }`}
        >
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
            liked ? "bg-rose-500/10" : "bg-slate-900/50 group-hover:bg-rose-500/10"
          }`}>
            <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
          </div>
          <span className="text-xs font-semibold">{post.likes.length}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          className="group flex items-center gap-1.5 text-slate-500 transition-colors hover:text-cyan-400"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/50 group-hover:bg-cyan-500/10">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold">{post.replies.length}</span>
        </button>

        <Link
          to={`/${postedBy}/post/${post._id}`}
          className="group flex items-center gap-1.5 text-slate-500 transition-colors hover:text-cyan-400"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/50 group-hover:bg-cyan-500/10">
            <Eye className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold">Discuss</span>
        </Link>

        <button
          type="button"
          className="group flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900/50 text-slate-500 transition-colors hover:bg-violet-500/10 hover:text-violet-400"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post your reply"
      >
        <div className="flex gap-4">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-700/50">
            {user?.profilePic ? (
              <img src={user.profilePic} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-800 text-xs font-bold text-slate-400">
                {user?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-4">
            <textarea
              autoFocus
              placeholder="What's your reply?"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="min-h-[100px] w-full resize-none bg-transparent text-sm text-white outline-none placeholder:text-slate-600"
            />
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleReply}
                disabled={isReplying || !reply.trim()}
                className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                {isReplying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Reply
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Actions;
