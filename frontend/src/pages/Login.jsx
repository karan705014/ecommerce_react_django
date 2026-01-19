import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
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
                setTimeout(() => navigate("/"), 800);
            } else {
                setMessage("Invalid credentials. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setMessage(error.message);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 mt-8">
            <div className="
                max-w-md w-full
                bg-white/10 backdrop-blur-xl
                border border-white/20
                rounded-2xl p-8
                shadow-[0_0_30px_rgba(99,102,241,0.3)]
            ">
                <h2 className="
                    text-3xl font-extrabold text-center mb-6
                    bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                    text-transparent bg-clip-text
                ">
                    Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Username"
                        className="
                            w-full p-3 rounded-lg
                            bg-slate-800 text-white
                            border border-slate-600
                            focus:outline-none focus:ring-2 focus:ring-indigo-400
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
                            border border-slate-600
                            focus:outline-none focus:ring-2 focus:ring-pink-400
                        "
                    />


                    <button
                        className="
                            w-full py-3 rounded-xl font-bold text-white
                            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                            shadow-[0_0_25px_rgba(168,85,247,0.6)]
                            hover:shadow-[0_0_40px_rgba(236,72,153,0.9)]
                            active:scale-95
                            active:shadow-[0_0_60px_rgba(236,72,153,1)]
                            transition-all duration-300
                        "
                    >
                        Login
                    </button>
                </form>

                {message && (
                    <p className="
                       mt-6 text-center
                     text-green-400 font-semibold
                     bg-pink-500/10
                       border border-pink-500/30
                       px-4 py-2 rounded-lg
                        shadow-[0_0_15px_rgba(236,72,153,0.6)]
                        ">
                        {message}
                    </p>
                )}

                <p className="mt-6 text-center text-gray-300">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-indigo-400 hover:underline">
                        Sign Up
                    </a>
                </p>
            </div>
        </div>
    );
}
export default Login;