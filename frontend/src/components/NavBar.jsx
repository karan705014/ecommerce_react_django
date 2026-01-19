

import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";

function NavBar() {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const isLoggedIn = !!getAccessToken();

    const handleLogout = () => {
        clearTokens();
        clearCart();
        navigate("/login");
    };

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <nav className="
            fixed top-0 left-0 w-full z-50
            bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800
            shadow-lg border-b border-white/10
        ">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo / Brand */}
                <Link
                    to="/"
                    className="
                        text-2xl font-extrabold tracking-wider
                        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                        text-transparent bg-clip-text
                        hover:from-pink-400 hover:to-indigo-400
                        transition-all duration-300
                    "
                >
                    kartZone
                </Link>
                <div>
                    {/* {login/signup/logout} */}
                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="
                                    mr-4 text-white
                                    hover:underline
                                "
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="
                                    text-white
                                    hover:underline
                                "
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="
                                text-white
                                hover:underline
                            "
                        >
                            Logout
                        </button>
                    )}
                </div>

                {/* Cart Button */}
                <Link
                    to="/cart"
                    className="
        relative inline-flex items-center gap-2
        px-5 py-2.5 rounded-xl
        text-sm font-bold tracking-wide text-white

        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500

        shadow-[0_0_18px_rgba(168,85,247,0.6)]
        hover:shadow-[0_0_35px_rgba(236,72,153,0.9)]

        hover:from-pink-500 hover:to-indigo-500

        active:scale-95
        active:shadow-[0_0_55px_rgba(236,72,153,1)]

        transition-all duration-300
    "
                >
                    🛒 Cart

                    {cartCount > 0 && (
                        <span
                            className="
                absolute -top-2 -right-2
                flex items-center justify-center
                w-6 h-6 text-xs font-extrabold

                text-white
                bg-gradient-to-r from-red-500 to-pink-500

                rounded-full
                border border-white/30

                shadow-[0_0_12px_rgba(239,68,68,0.9)]
            "
                        >
                            {cartCount}
                        </span>
                    )}
                </Link>


            </div>
        </nav>
    );
}

export default NavBar;
