import { motion } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import { BsCheck2All, BsImage } from "react-icons/bs";

const Conversation = ({ conversation, isOnline }) => {
  const user = conversation.participants[0];
  const currentUser = useRecoilValue(userAtom);
  const lastMessage = conversation.lastMessage;
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom);

  const isSelected = selectedConversation?._id === conversation._id;
  const isOwn = currentUser._id === lastMessage?.sender;

  const preview = lastMessage?.text
    ? lastMessage.text.length > 28
      ? lastMessage.text.substring(0, 28) + "…"
      : lastMessage.text
    : null;

  return (
    <motion.button
      type="button"
      layout
      whileHover={{ x: 2 }}
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        })
      }
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all duration-200 ${
        isSelected
          ? "bg-cyan-500/10 border border-cyan-400/20"
          : "border border-transparent hover:bg-slate-800/60"
      }`}
    >
      {/* Avatar with online indicator */}
      <div className="relative shrink-0">
        <div className="h-12 w-12 overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900">
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.username} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-slate-400">
              {user.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        {isOnline && (
          <span className="absolute -bottom-0.5 -right-0.5 block h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
        )}
      </div>

      {/* Text content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className={`truncate text-sm font-semibold ${isSelected ? "text-cyan-300" : "text-white"}`}>
            {user.username}
          </p>
          {isOnline && (
            <span className="shrink-0 text-xs text-emerald-400">Online</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          {isOwn && (
            <BsCheck2All
              className={`shrink-0 text-[13px] ${lastMessage?.seen ? "text-cyan-400" : "text-slate-500"}`}
            />
          )}
          {preview ? (
            <p className="truncate text-xs text-slate-400">{preview}</p>
          ) : (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <BsImage className="text-[11px]" /> Photo
            </span>
          )}
        </div>
      </div>

      {/* Unseen dot */}
      {!lastMessage?.seen && !isOwn && (
        <div className="shrink-0 h-2 w-2 rounded-full bg-cyan-400" />
      )}
    </motion.button>
  );
};

export default Conversation;
