import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import Conversation from "../components/Conversation";
import MessageContainer from "../components/MessageContainer";
import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext";
import { Search, MessageSquare, Sparkles, ChevronLeft, UserPlus, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatPage = () => {
  const [searchingUser, setSearchingUser] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );
  const [conversations, setConversations] = useRecoilState(conversationsAtom);
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const { socket, onlineUsers } = useSocket();

  useEffect(() => {
    socket?.on("messagesSeen", ({ conversationId }) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation._id === conversationId
            ? {
                ...conversation,
                lastMessage: {
                  ...conversation.lastMessage,
                  seen: true,
                },
              }
            : conversation
        )
      );
    });
    return () => socket?.off("messagesSeen");
  }, [socket, setConversations]);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setConversations(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoadingConversations(false);
      }
    };
    getConversations();
  }, [showToast, setConversations]);

  const handleConversationSearch = async (e) => {
    e?.preventDefault();
    if (!searchText.trim()) return;
    if (searchingUser) return;

    setSearchingUser(true);
    try {
      const res = await fetch(`/api/users/profile/${searchText}`);
      const searchedUser = await res.json();
      if (searchedUser.error) {
        showToast("Error", searchedUser.error, "error");
        return;
      }

      if (searchedUser._id === currentUser._id) {
        showToast("Error", "You cannot message yourself", "error");
        return;
      }

      const existing = conversations.find(
        (conversation) => conversation.participants[0]._id === searchedUser._id
      );

      if (existing) {
        setSelectedConversation({
          _id: existing._id,
          userId: searchedUser._id,
          username: searchedUser.username,
          userProfilePic: searchedUser.profilePic,
        });
        setSearchText("");
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage: {
          text: "Say hello to start chatting.",
          sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchedUser._id,
            username: searchedUser.username,
            profilePic: searchedUser.profilePic,
          },
        ],
      };
      setConversations((prev) => [mockConversation, ...prev]);
      setSelectedConversation({
        _id: mockConversation._id,
        userId: searchedUser._id,
        username: searchedUser.username,
        userProfilePic: searchedUser.profilePic,
      });
      setSearchText("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setSearchingUser(false);
    }
  };

  return (
    <div className="w-full">
      <div className="glass-card flex h-[calc(100vh-140px)] min-h-[600px] overflow-hidden rounded-[2.5rem] border border-slate-800/70 shadow-card">
        
        {/* Sidebar */}
        <aside className={`flex w-full flex-col border-r border-slate-800/70 bg-slate-950/40 md:w-80 lg:w-96 ${selectedConversation._id ? "hidden md:flex" : "flex"}`}>
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">Messages</h1>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>

            <form onSubmit={handleConversationSearch} className="relative">
              <input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search friends..."
                className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <button type="submit" hidden />
              {searchingUser && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                </div>
              )}
            </form>
          </div>

          <div className="flex-1 overflow-y-auto px-3 pb-6">
            <div className="space-y-1">
              {loadingConversations ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 w-full rounded-2xl shimmer" />
                ))
              ) : conversations.length === 0 ? (
                <div className="mt-10 px-6 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-slate-700">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium text-slate-500">No conversations yet</p>
                  <p className="mt-1 text-xs text-slate-600">Search for friends to start chatting</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <Conversation
                    key={conversation._id}
                    isOnline={onlineUsers.includes(conversation.participants[0]?._id)}
                    conversation={conversation}
                  />
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Chat Window */}
        <main className={`relative flex-1 bg-slate-900/20 ${!selectedConversation._id ? "hidden md:flex" : "flex"}`}>
          <AnimatePresence mode="wait">
            {selectedConversation._id ? (
              <motion.div
                key={selectedConversation._id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex h-full w-full flex-col p-4 md:p-6"
              >
                {/* Mobile Back Button */}
                <button
                  onClick={() => setSelectedConversation({ _id: "", userId: "", username: "", userProfilePic: "" })}
                  className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-500 md:hidden"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to list
                </button>
                <MessageContainer />
              </motion.div>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="relative mx-auto h-32 w-32">
                    <div className="absolute inset-0 animate-pulse-glow rounded-full bg-cyan-400/20" />
                    <div className="relative flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-cyan-400 shadow-inner">
                      <Sparkles className="h-12 w-12" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-white">Your Conversations</h2>
                    <p className="mx-auto max-w-sm text-sm leading-relaxed text-slate-500">
                      Select a friend from the list to start a secure, real-time conversation. Everything you share is private.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                    {["End-to-end encryption", "Real-time updates", "Media sharing"].map((feat) => (
                      <span key={feat} className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-600 border border-slate-800">
                        {feat}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
