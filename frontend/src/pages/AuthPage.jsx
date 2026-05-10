import { useRecoilValue } from "recoil";
import LoginCard from "../components/LoginCard";
import SignupCard from "../components/SignupCard";
import authScreenAtom from "../atoms/authAtom";

const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {authScreenState === "login" ? <LoginCard /> : <SignupCard />}
      </div>

      {/* Footer note */}
      <p className="relative z-10 mt-8 text-center text-xs text-slate-600">
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </p>
    </div>
  );
};

export default AuthPage;
