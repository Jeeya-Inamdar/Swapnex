import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { Plus, Image as ImageIcon, X, Send, Loader2 } from "lucide-react";
import Modal from "./Modal";
import { motion, AnimatePresence } from "framer-motion";
import createPostModalAtom from "../atoms/createPostModalAtom";

const MAX_CHAR = 500;

const CreatePost = () => {
  const [isOpen, setIsOpen] = useRecoilState(createPostModalAtom);
  const [postText, setPostText] = useState("");
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
  const imageRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
  const user = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useRecoilState(postsAtom);

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length > MAX_CHAR) {
      setPostText(inputText.slice(0, MAX_CHAR));
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !user._id) {
      showToast("Error", "You must be logged in to create a post", "error");
      return;
    }
    if (!postText.trim() && !imgUrl) {
      showToast("Oops", "Your post can't be empty.", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postedBy: user._id, text: postText, img: imgUrl }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post created successfully", "success");
      setPosts([data, ...posts]);
      setIsOpen(false);
      setPostText("");
      setImgUrl("");
      setRemainingChar(MAX_CHAR);
    } catch (error) {
      showToast("Error", error.message || error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-slate-950 shadow-xl shadow-cyan-500/30 lg:bottom-10 lg:right-10 lg:h-16 lg:w-16 lg:rounded-[2rem]"
      >
        <Plus className="h-7 w-7 lg:h-8 lg:w-8" />
      </motion.button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New Post"
      >
        <div className="space-y-6">
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
            <div className="flex-1">
              <textarea
                autoFocus
                placeholder="What's on your mind?"
                value={postText}
                onChange={handleTextChange}
                className="min-h-[120px] w-full resize-none bg-transparent text-base text-white outline-none placeholder:text-slate-600"
              />
            </div>
          </div>

          <AnimatePresence>
            {imgUrl && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-900"
              >
                <img src={imgUrl} alt="preview" className="max-h-72 w-full object-contain" />
                <button
                  type="button"
                  onClick={() => setImgUrl("")}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/90 text-white shadow transition hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-slate-800/50 pt-4">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => imageRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/50 text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-400"
              >
                <ImageIcon className="h-5 w-5" />
              </button>
              <input type="file" accept="image/*" hidden ref={imageRef} onChange={handleImageChange} />
              
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  remainingChar < 50 ? "text-rose-400" : "text-slate-600"
                }`}>
                  Characters
                </span>
                <span className={`text-xs font-bold ${
                  remainingChar < 50 ? "text-rose-400" : "text-slate-400"
                }`}>
                  {remainingChar} / {MAX_CHAR}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreatePost}
              disabled={loading || (!postText.trim() && !imgUrl)}
              className="flex items-center gap-2 rounded-2xl bg-cyan-500 px-8 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Post Now
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CreatePost;
