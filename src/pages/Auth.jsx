import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, useLocation } from "react-router-dom";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const navigate = useNavigate();
  const redirect = new URLSearchParams(useLocation().search).get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: displayName } } });
        if (error) throw error;
      }
      navigate(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-96 bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">{isLogin ? "Kirish" : "Ro‘yxatdan o‘tish"}</h2>
          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && <input type="text" placeholder="To‘liq Ism" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="input input-bordered w-full" required />}
            <input type="email" placeholder="Email manzil" value={email} onChange={(e) => setEmail(e.target.value)} className="input input-bordered w-full" required />
            <input type="password" placeholder="Parol" value={password} onChange={(e) => setPassword(e.target.value)} className="input input-bordered w-full" required />
            <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
              {loading && <span className="loading loading-spinner"></span>}
              {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
            </button>
          </form>

          <button onClick={handleGoogleSignIn} className="btn w-full flex items-center justify-center gap-2 bg-white text-black border border-[#e5e5e5] mt-2" disabled={googleLoading}>
            {googleLoading && <span className="loading loading-spinner"></span>}
            Google bilan Kirish
          </button>

          <p className="mt-4 text-center text-sm cursor-pointer text-blue-600 hover:underline" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Yangi hisob yaratish" : "Allaqachon hisobingiz bormi?"}
          </p>
        </div>
      </div>
    </div>
  );
}
