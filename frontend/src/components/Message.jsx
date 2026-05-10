import { useState } from "react";
import { useRecoilValue } from "recoil";
import { selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { BsCheck2All } from "react-icons/bs";
import { motion } from "framer-motion";

const Message = ({ ownMessage, message }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom);
  const [imgLoaded, setImgLoaded] = useState(false);

  const avatar = ownMessage ? user?.profilePic : selectedConversation?.userProfilePic;
  const initial = ownMessage
    ? user?.username?.[0]?.toUpperCase()
    : selectedConversation?.username?.[0]?.toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex items-end gap-2 ${ownMessage ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar */}
      <div className="mb-1 shrink-0">
        <div className="h-7 w-7 overflow-hidden rounded-xl bg-slate-800 border border-slate-700/60">
          {avatar ? (
            <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-400">
              {initial}
            </div>
          )}
        </div>
      </div>

      {/* Bubble group */}
      <div className={`flex max-w-[70%] flex-col gap-1 ${ownMessage ? "items-end" : "items-start"}`}>
        {/* Text bubble */}
        {message.text && (
          <div
            className={`px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              ownMessage
                ? "chat-bubble-own bg-gradient-to-br from-cyan-500/80 to-cyan-600/80 text-white"
                : "chat-bubble-other bg-slate-800/90 text-slate-100"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Image */}
        {message.img && (
          <div className="overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900">
            {!imgLoaded && (
              <div className="shimmer h-48 w-56" />
            )}
            <img
              src={message.img}
              alt="message media"
              onLoad={() => setImgLoaded(true)}
              className={`max-w-[240px] object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0 absolute"}`}
            />
          </div>
        )}

        {/* Seen / timestamp */}
        {ownMessage && (
          <div className="flex items-center gap-1 px-1">
            <BsCheck2All
              className={`text-sm ${message.seen ? "text-cyan-400" : "text-slate-500"}`}
            />
            <span className="text-[10px] text-slate-600">
              {message.seen ? "Seen" : "Delivered"}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Message;
