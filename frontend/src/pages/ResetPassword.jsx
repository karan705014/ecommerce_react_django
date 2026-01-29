import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `${BASEURL}/api/reset/password/${uidb64}/${token}/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            new_password: newPassword,
            confirm_password: confirmPassword,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Reset failed");
      }

      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successful. Please login." },
        });
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="max-w-md w-full bg-slate-900/80 border border-cyan-400/30 rounded-2xl p-8">
        <h2 className="text-2xl text-center text-cyan-400 mb-6">
          Set New Password
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {message && <p className="text-green-500 mb-3">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-slate-800 text-white"
          />

          <button className="w-full bg-cyan-500 py-3 rounded-lg text-white font-bold">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
