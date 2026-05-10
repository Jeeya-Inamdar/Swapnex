import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Comment = ({ reply, lastReply }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`group relative flex gap-4 py-4 ${
        !lastReply ? "border-b border-slate-800/50" : ""
      }`}
    >
      <Link to={`/${reply.username}`} className="shrink-0">
        <div className="h-10 w-10 overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900 shadow-sm transition group-hover:border-cyan-400/40">
          {reply.userProfilePic ? (
            <img
              src={reply.userProfilePic}
              alt={reply.username}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-500">
              {reply.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <Link
            to={`/${reply.username}`}
            className="text-sm font-semibold text-white transition hover:text-cyan-300"
          >
            {reply.username}
          </Link>
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Reply
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          {reply.text}
        </p>
      </div>
    </motion.div>
  );
};

export default Comment;
