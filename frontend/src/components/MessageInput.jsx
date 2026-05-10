import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Image as ImageIcon, X, Loader2 } from "lucide-react";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import usePreviewImg from "../hooks/usePreviewImg";

const MessageInput = ({ setMessages, onTyping }) => {
  const [messageText, setMessageText] = useState("");
  const showToast = useShowToast();
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const [isSending, setIsSending] = useState(false);
  const typingTimeoutRef = useRef(null);

  const handleTextChange = (e) => {
    setMessageText(e.target.value);
    // Notify parent of typing
    if (onTyping) onTyping(true);
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (onTyping) onTyping(false);
    }, 1500);
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageText.trim() && !imgUrl) return;
    if (isSending) return;

    if (onTyping) onTyping(false);
    setIsSending(true);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      setMessages((msgs) => [...msgs, data]);
      setConversations((prev) =>
        prev.map((c) =>
          c._id === selectedConversation._id
            ? { ...c, lastMessage: { text: messageText, sender: data.sender } }
            : c
        )
      );
      setMessageText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-2 border-t border-slate-800/70 pt-3">
      {/* Image preview */}
      <AnimatePresence>
        {imgUrl && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900"
          >
            <img src={imgUrl} alt="preview" className="max-h-48 w-full object-contain" />
            <button
              type="button"
              onClick={() => setImgUrl("")}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-slate-950/90 text-white shadow transition hover:bg-slate-800"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            <div className="absolute bottom-2 right-2">
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={isSending}
                className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-60"
              >
                {isSending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        {/* Image attach */}
        <button
          type="button"
          onClick={() => imageRef.current?.click()}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700/70 bg-slate-900/80 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <input type="file" hidden ref={imageRef} onChange={handleImageChange} accept="image/*" />

        {/* Text input */}
        <div className="relative flex-1">
          <input
            id="message-input"
            type="text"
            placeholder="Type a message…"
            value={messageText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            className="w-full rounded-2xl border border-slate-700/70 bg-slate-900/80 px-4 py-2.5 pr-12 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
          />
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={isSending || (!messageText.trim() && !imgUrl)}
          className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 transition hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
