import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useCart } from "../context/CartContext";

function Login() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [form, setForm] = useState({ username: "", password: "" });
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { fetchCart } = useCart();

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location.state]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const res = await fetch(`${BASEURL}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                const data = await res.json();
                saveToken(data);
                await fetchCart();
                setMessage("Login successful! Redirecting...");
                setTimeout(() => navigate("/"), 900);
            } else {
                setMessage("Invalid credentials. Please try again.");
            }
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
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
                    Login
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
                        Login
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

                {/* Signup link */}
                <p className="mt-6 text-center text-gray-300">
                    Don’t have an account?{" "}
                    <a
                        href="/signup"
                        className="text-cyan-400 hover:text-cyan-300 transition"
                    >
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}

export default Login;
