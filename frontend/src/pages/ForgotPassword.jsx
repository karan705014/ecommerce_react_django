import { useState } from "react";

function ForgotPassword() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // 👈 NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);        // 👈 waiting start
    setUsername("");         // 👈 clear input immediately

    try {
      const res = await fetch(`${BASEURL}/api/reset/password/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessage("✓ Password reset link sent. Please check your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);     // 👈 waiting end
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="max-w-md w-full bg-slate-900/80 border border-cyan-400/30 rounded-2xl p-8">
        <h2 className="text-2xl text-center text-cyan-400 mb-6">
          Reset Password
        </h2>

        {/* WAITING MESSAGE */}
        {loading && (
          <p className="text-yellow-400 mb-3 text-center animate-pulse">
             Sending reset link, please wait...
          </p>
        )}

        {/* ERROR */}
        {error && <p className="text-red-500 mb-3">{error}</p>}

        {/* SUCCESS */}
        {message && <p className="text-green-500 mb-3">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            disabled={loading}   //  disable while loading
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white disabled:opacity-50"
          />

          <button
            disabled={loading}
            className="
              w-full py-3 rounded-lg text-white font-bold
              bg-cyan-500 hover:bg-cyan-600
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
