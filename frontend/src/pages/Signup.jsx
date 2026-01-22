import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch(`${BASEURL}/api/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Signup successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1000);
            } else {
                setMessage(JSON.stringify(data));
            }
        } catch {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 pt-28 px-6 flex justify-center">
            <div
                className="
                    max-w-md w-full
                    bg-slate-900/80 backdrop-blur-xl
                    border border-cyan-400/30
                    rounded-2xl p-8
                    shadow-[0_0_40px_rgba(34,211,238,0.25)]
                "
            >
                {/* Heading */}
                <h2
                    className="
                        text-3xl font-extrabold text-center mb-6
                        bg-gradient-to-r from-cyan-400 to-blue-500
                        text-transparent bg-clip-text
                        tracking-wide
                    "
                >
                    Create Account
                </h2>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="
                            w-full p-3 rounded-lg
                            bg-slate-800 text-white
                            border border-cyan-400/20
                            focus:outline-none
                            focus:ring-2 focus:ring-cyan-400/60
                            transition
                        "
                    />

                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="
                            w-full p-3 rounded-lg
                            bg-slate-800 text-white
                            border border-cyan-400/20
                            focus:outline-none
                            focus:ring-2 focus:ring-blue-400/60
                            transition
                        "
                    />

                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="
                            w-full p-3 rounded-lg
                            bg-slate-800 text-white
                            border border-cyan-400/20
                            focus:outline-none
                            focus:ring-2 focus:ring-cyan-400/60
                            transition
                        "
                    />

                    <input
                        name="password2"
                        type="password"
                        value={form.password2}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        className="
                            w-full p-3 rounded-lg
                            bg-slate-800 text-white
                            border border-cyan-400/20
                            focus:outline-none
                            focus:ring-2 focus:ring-blue-400/60
                            transition
                        "
                    />

                    <button
                        className="
                            w-full py-3 rounded-xl
                            font-bold text-white
                            bg-gradient-to-r from-cyan-500 to-blue-500

                            shadow-[0_0_20px_rgba(34,211,238,0.4)]
                            hover:shadow-[0_0_32px_rgba(34,211,238,0.6)]

                            active:scale-[0.97]
                            active:shadow-[0_0_40px_rgba(34,211,238,0.8)]

                            transition-all duration-300
                        "
                    >
                        Create Account
                    </button>
                </form>

                {/* Message */}
                {message && (
                    <p
                        className="
                            mt-6 text-center
                            text-cyan-300 font-semibold
                            bg-cyan-500/10
                            border border-cyan-400/30
                            px-4 py-2 rounded-lg
                            shadow-[0_0_15px_rgba(34,211,238,0.4)]
                        "
                    >
                        {message}
                    </p>
                )}

                {/* Login link */}
                <p className="mt-6 text-center text-gray-300">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-cyan-400 hover:text-cyan-300 transition"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Signup;
