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
                setMessage("Signup successful! Redirecting...");
                setTimeout(() => navigate("/login"), 1000);
            } else {
                setMessage(JSON.stringify(data));
            }
        } catch {
            setMessage("Server error. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 mt-12">
            <div className="
                max-w-md w-full
                bg-white/10 backdrop-blur-xl
                border border-white/20
                rounded-2xl p-8
                shadow-[0_0_30px_rgba(236,72,153,0.3)]
            ">
                <h2 className="
                    text-3xl font-extrabold text-center mb-6
                    bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400
                    text-transparent bg-clip-text
                ">
                    Sign Up
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {["username", "email", "password", "password2"].map((field, i) => (
                        <input
                            key={i}
                            name={field}
                            type={field.includes("password") ? "password" : "text"}
                            placeholder={field.replace("2", " (confirm)")}
                            value={form[field]}
                            onChange={handleChange}
                            className="
                                w-full p-3 rounded-lg
                                bg-slate-800 text-white
                                border border-slate-600
                                focus:outline-none focus:ring-2 focus:ring-purple-400
                            "
                        />
                    ))}

                    {/*  GLOW BUTTON */}
                    <button
                        className="
                            w-full py-3 rounded-xl font-bold text-white
                            bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500
                            shadow-[0_0_25px_rgba(99,102,241,0.6)]
                            hover:shadow-[0_0_45px_rgba(99,102,241,0.9)]
                            active:scale-95
                            active:shadow-[0_0_70px_rgba(99,102,241,1)]
                            transition-all duration-300
                        "
                    >
                        Create Account
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-center text-pink-400 font-semibold">
                        {message}
                    </p>
                )}

                <p className="mt-6 text-center text-gray-300">
                    Already have an account?{" "}
                    <a href="/login" className="text-indigo-400 hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
export default Signup;