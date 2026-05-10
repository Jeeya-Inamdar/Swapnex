import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { Camera, Mail, User, UserCircle2, Lock, Loader2, Save, X } from "lucide-react";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import { useNavigate } from "react-router-dom";

export default function UpdateProfilePage() {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
    bio: user.bio || "",
    password: "",
  });
  const fileRef = useRef(null);
  const [updating, setUpdating] = useState(false);
  const showToast = useShowToast();
  const { handleImageChange, imgUrl } = usePreviewImg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile updated successfully", "success");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
      navigate(`/${data.username}`);
    } catch (error) {
      showToast("Error", error.message || String(error), "error");
    } finally {
      setUpdating(false);
    }
  };

  const avatarSrc = imgUrl || user.profilePic;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="glass-card rounded-[2rem] border border-slate-800/70 p-6 shadow-card">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
              <UserCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Edit Profile</h1>
              <p className="text-sm text-slate-400">Update your public information</p>
            </div>
          </div>
        </div>

        {/* Avatar section */}
        <div className="glass-card rounded-[2rem] border border-slate-800/70 p-6 shadow-card">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Profile Photo</p>
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="h-24 w-24 overflow-hidden rounded-3xl border-2 border-slate-700/70 bg-slate-900">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl text-slate-600">
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400 text-slate-950 shadow-lg transition hover:bg-cyan-300"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input type="file" accept="image/*" hidden ref={fileRef} onChange={handleImageChange} />
            </div>
            <div>
              <p className="font-semibold text-white">@{user.username}</p>
              <p className="mt-1 text-sm text-slate-400">JPG, PNG or GIF · Max 10MB</p>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-2 inline-flex items-center gap-1.5 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
              >
                <Camera className="h-3.5 w-3.5" />
                Change photo
              </button>
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div className="glass-card rounded-[2rem] border border-slate-800/70 p-6 shadow-card">
          <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-400">Account Details</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { label: "Full name",  key: "name",     icon: UserCircle2, type: "text",  placeholder: "Your full name" },
              { label: "Username",   key: "username", icon: User,        type: "text",  placeholder: "yourhandle" },
              { label: "Email",      key: "email",    icon: Mail,        type: "email", placeholder: "you@example.com" },
            ].map(({ label, key, icon: Icon, type, placeholder }) => (
              <div key={key} className={key === "email" ? "sm:col-span-2" : ""}>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {label}
                </label>
                <div className="relative">
                  <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={inputs[key]}
                    onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
                    className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/80 py-3 pl-10 pr-4 text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
                  />
                </div>
              </div>
            ))}

            {/* Bio full-width */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Bio</label>
              <textarea
                rows={3}
                placeholder="Tell the community about yourself..."
                value={inputs.bio}
                onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
                className="w-full resize-none rounded-2xl border border-slate-800/80 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
              />
            </div>

            {/* New Password */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                New Password <span className="normal-case text-slate-600">(leave blank to keep current)</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  placeholder="New password"
                  value={inputs.password}
                  onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                  className="w-full rounded-2xl border border-slate-800/80 bg-slate-900/80 py-3 pl-10 pr-4 text-slate-100 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/70 bg-slate-900/70 px-5 py-2.5 text-sm font-semibold text-slate-300 transition-all hover:border-slate-600 hover:bg-slate-800/80 hover:text-white"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {updating ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
