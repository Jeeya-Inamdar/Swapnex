import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Phone, Video, MoreHorizontal } from "lucide-react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext.jsx";
import messageSound from "../assets/sounds/message.mp3";

/* --- Skeleton row --- */
const MessageSkeleton = ({ reverse }) => (
  <div className={`flex items-end gap-2 ${reverse ? "flex-row-reverse" : ""}`}>
    <div className="h-7 w-7 shrink-0 rounded-xl shimmer" />
    <div className={`flex flex-col gap-1.5 ${reverse ? "items-end" : ""}`}>
      <div className="shimmer h-9 w-48 rounded-2xl" />
      <div className="shimmer h-5 w-32 rounded-xl" />
    </div>
  </div>
);

const MessageContainer = () => {
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userIsTyping, setUserIsTyping] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const { socket } = useSocket();
  const setConversations = useSetRecoilState(conversationsAtom);
  const messageEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /* ---------- socket: new messages & typing ---------- */
  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (message) => {
      if (selectedConversation._id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
      }
      if (!document.hasFocus()) {
        const sound = new Audio(messageSound);
        sound.play().catch(() => {});
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === message.conversationId
            ? { ...c, lastMessage: { text: message.text, sender: message.sender } }
            : c
        )
      );
    });

    socket.on("typing", ({ conversationId }) => {
      if (conversationId === selectedConversation._id) {
        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
      }
    });

    return () => {
      socket.off("newMessage");
      socket.off("typing");
    };
  }, [socket, selectedConversation, setConversations]);

  /* ---------- socket: message seen ---------- */
  useEffect(() => {
    if (!socket) return;

    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.sender !== currentUser._id) {
      socket.emit("markMessagesAsSeen", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }

    socket.on("messagesSeen", ({ conversationId }) => {
      if (selectedConversation._id === conversationId) {
        setMessages((prev) =>
          prev.map((m) => (!m.seen ? { ...m, seen: true } : m))
        );
      }
    });

    return () => socket.off("messagesSeen");
  }, [socket, currentUser._id, messages, selectedConversation]);

  /* ---------- scroll to bottom ---------- */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  /* ---------- load messages ---------- */
  useEffect(() => {
    const getMessages = async () => {
      setLoadingMessages(true);
      setMessages([]);
      try {
        if (selectedConversation.mock) return;
        const res = await fetch(`/api/messages/${selectedConversation.userId}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setMessages(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingMessages(false);
      }
    };
    getMessages();
  }, [showToast, selectedConversation.userId, selectedConversation.mock]);

  /* ---------- send typing events ---------- */
  const handleTyping = (typing) => {
    if (!socket) return;
    if (typing) {
      socket.emit("typing", {
        conversationId: selectedConversation._id,
        userId: selectedConversation.userId,
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-3">
        <Link to={`/${selectedConversation.username}`} className="flex items-center gap-3 transition-opacity hover:opacity-80">
          <div className="relative">
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900">
              {selectedConversation.userProfilePic ? (
                <img
                  src={selectedConversation.userProfilePic}
                  alt={selectedConversation.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                  {selectedConversation.username?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <div>
            <p className="font-semibold text-white">{selectedConversation.username}</p>
            {isTyping ? (
              <div className="flex items-center gap-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="ml-1 text-xs text-cyan-400">typing</span>
              </div>
            ) : (
              <p className="text-xs text-slate-500 underline-offset-2 hover:underline">Click to view profile</p>
            )}
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/70 bg-slate-900/70 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <Phone className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/70 bg-slate-900/70 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <Video className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800/70 bg-slate-900/70 text-slate-400 transition hover:border-slate-700 hover:text-white"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-1 py-2 min-h-0">
        {loadingMessages &&
          [...Array(5)].map((_, i) => <MessageSkeleton key={i} reverse={i % 2 !== 0} />)}

        {!loadingMessages && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full items-center justify-center"
          >
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80 text-4xl">
                👋
              </div>
              <p className="font-semibold text-white">Say hello!</p>
              <p className="mt-1 text-sm text-slate-400">Start the conversation with {selectedConversation.username}</p>
            </div>
          </motion.div>
        )}

        {!loadingMessages &&
          messages.map((message, i) => (
            <div
              key={message._id}
              ref={i === messages.length - 1 ? messageEndRef : null}
            >
              <Message
                message={message}
                ownMessage={currentUser._id === message.sender}
              />
            </div>
          ))}

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-2"
          >
            <div className="h-7 w-7 overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900">
              {selectedConversation.userProfilePic && (
                <img src={selectedConversation.userProfilePic} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <div className="chat-bubble-other flex items-center gap-1.5 bg-slate-800/90 px-4 py-3">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </motion.div>
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <MessageInput setMessages={setMessages} onTyping={handleTyping} />
    </div>
  );
};

export default MessageContainer;
