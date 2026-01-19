import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/");
  };

  const googleLogin = async () => {
    await signInWithPopup(auth, googleProvider);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
      <div className="backdrop-blur-xl bg-white/10 p-8 rounded-2xl w-[380px] shadow-2xl transition-all hover:scale-[1.02]">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back 👋
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-black/30 text-white outline-none focus:ring-2 ring-indigo-500 transition"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-black/30 text-white outline-none focus:ring-2 ring-indigo-500 transition"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition text-white font-semibold cursor-pointer">
            Login
          </button>
        </form>

        <button
          onClick={googleLogin}
          className="mt-4 w-full py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition cursor-pointer"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-300 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-indigo-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
