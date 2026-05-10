import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import MobileNav from "./components/MobileNav";
import { Toaster } from "react-hot-toast";

function App() {
  const user = useRecoilValue(userAtom);
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-x-hidden">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: "glass-card border border-slate-800 text-white rounded-2xl",
          style: {
            background: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
            color: "#fff",
            border: "1px solid rgba(148, 163, 184, 0.1)",
          },
        }}
      />
      
      <Header />

      <main className={`w-full px-2 py-4 sm:px-4 lg:px-6 ${user ? "pb-24 lg:pb-8" : "pb-8"}`}>
        <div className="grid gap-6 grid-cols-1">
          <section className="animate-fade-up space-y-6">
            <Routes>
              <Route
                path="/"
                element={user ? <HomePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/auth"
                element={!user ? <AuthPage /> : <Navigate to="/" />}
              />
              <Route
                path="/update"
                element={user ? <UpdateProfilePage /> : <Navigate to="/auth" />}
              />
              <Route
                path="/chat"
                element={user ? <ChatPage /> : <Navigate to={'/auth'} />}
              />
              <Route
                path="/settings"
                element={user ? <SettingsPage /> : <Navigate to={'/auth'} />}
              />
              <Route
                path="/:username"
                element={
                  user ? (
                    <>
                      <UserPage />
                      <CreatePost />
                    </>
                  ) : (
                    <UserPage />
                  )
                }
              />
              <Route path="/:username/post/:pid" element={<PostPage />} />
            </Routes>
          </section>
        </div>
      </main>

      {user && pathname !== "/auth" && <MobileNav />}
      {user && pathname !== "/auth" && pathname !== "/chat" && <CreatePost />}
    </div>
  );
}

export default App;
