import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";

function NavBar() {
    const { cartItems, clearCart } = useCart();
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const isLoggedIn = !!getAccessToken();

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`${BASEURL}/api/categories/`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.log(err));
    }, [BASEURL]);

    //  FIXED SEARCH HANDLER
    const handleSearch = (e) => {
        e.preventDefault();
        if (search.trim()) {
            navigate(`/?search=${encodeURIComponent(search.trim())}`);
            setSearch("");
        }
    };

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
        <nav
            className="
                fixed top-0 left-0 w-full z-50
                bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800
                shadow-lg border-b border-white/10
            "
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                {/* Logo */}
                <Link
                    to="/"
                    className="
    inline-flex items-center justify-center
    px-4 py-2
    rounded-xl

    bg-slate-900
    border border-cyan-400/40

    bg-gradient-to-r from-cyan-400 to-blue-500
    text-transparent bg-clip-text
    text-2xl font-extrabold
    tracking-[0.15em]

    shadow-[0_0_14px_rgba(34,211,238,0.25)]
    hover:shadow-[0_0_22px_rgba(34,211,238,0.35)]

    transition-all duration-300 ease-out
  "
                >
                    KRN ZONE
                </Link>

                {/* Center Links */}
                <div className="flex items-center gap-6 text-white">
                    <Link
                        to="/"
                        className="
    px-4 py-1.5 rounded-lg
    text-sm font-medium
    text-cyan-300

    border border-cyan-400/40
    bg-slate-900

    transition-all duration-200 ease-out

    hover:bg-cyan-500/10
    hover:text-cyan-200

    active:scale-[0.96]
    active:shadow-[0_0_12px_rgba(34,211,238,0.35)]
  "
                    >
                        Home
                    </Link>

                    {/* Categories Dropdown */}
                    <div className="relative group">

                        {/* Trigger */}
                        <span
                            className="
            cursor-pointer
            px-4 py-1.5 rounded-lg
            text-sm font-medium text-cyan-300

            border border-cyan-400/40
            bg-slate-900

            transition-all duration-200 ease-out
            hover:bg-cyan-500/10
            hover:text-cyan-200
        "
                        >
                            Categories ▾
                        </span>

                        {/* INVISIBLE HOVER BRIDGE (SAME) */}
                        <div className="absolute left-0 top-full h-4 w-full"></div>

                        {/* Dropdown */}
                        <div
                            className="
            absolute left-0 top-full mt-4
            hidden group-hover:block

            bg-slate-900
            rounded-xl
            border border-cyan-400/30

            min-w-[180px]
            z-50

            shadow-[0_0_16px_rgba(34,211,238,0.25)]
        "
                        >
                            <Link
                                to="/"
                                className="
                block px-4 py-2
                text-cyan-300
                transition-colors
                hover:bg-cyan-500/10
                hover:text-cyan-200
            "
                            >
                                All Products
                            </Link>

                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    to={`/category/${cat.slug}`}
                                    className="
                    block px-4 py-2
                    text-cyan-300
                    transition-colors
                    hover:bg-cyan-500/10
                    hover:text-cyan-200
                "
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>


                </div>

                {/* SEARCH BAR */}
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
                            w-72 px-4 py-2 rounded-lg
                            bg-white text-gray-800
                            border border-orange-300
                            placeholder-gray-400
                            transition-all duration-300
                            hover:border-purple-500
                            focus:border-sky-400
                            focus:ring-2 focus:ring-sky-300
                            focus:outline-none
                        "
                    />

                    <button
                        type="submit"
                        className="
    px-5 py-2 rounded-lg
    bg-gradient-to-r from-cyan-500 to-blue-500
    text-white font-medium

    transition-all duration-200 ease-out

    active:scale-[0.97]
    active:shadow-[0_0_16px_rgba(34,211,238,0.45)]
    active:shadow-[inset_0_0_8px_rgba(255,255,255,0.35)]

    focus:outline-none
  "
                    >
                        Search
                    </button>
                </form>

                {/* Auth + Cart */}
                <div className="flex items-center gap-6 text-white">

                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className="
      px-4 py-1.5 rounded-lg
      text-sm font-medium
      text-cyan-300

      border border-cyan-400/40
      bg-slate-900

      transition-all duration-200 ease-out

      hover:bg-cyan-500/10
      hover:text-cyan-200

      active:scale-[0.96]
      active:shadow-[0_0_12px_rgba(34,211,238,0.35)]
    "
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="
      px-4 py-1.5 rounded-lg
      text-sm font-medium
      text-cyan-300

      border border-cyan-400/40
      bg-slate-900

      transition-all duration-200 ease-out

      hover:bg-cyan-500/10
      hover:text-cyan-200

      active:scale-[0.96]
      active:shadow-[0_0_12px_rgba(34,211,238,0.35)]
    "
                            >
                                Signup
                            </Link>
                        </>

                    ) : (
                        <button
                            onClick={handleLogout}
                            className="
    px-4 py-1.5 rounded-lg
    text-sm font-medium
    text-cyan-300

    border border-cyan-400/40
    bg-slate-900

    transition-all duration-200 ease-out

    hover:bg-cyan-500/10
    hover:text-cyan-200

    active:scale-[0.96]
    active:shadow-[0_0_12px_rgba(34,211,238,0.35)]
  "
                        >
                            Logout
                        </button>

                    )}

                    {/* Cart */}
                    <Link
                        to="/cart"
                        className="
    relative inline-flex items-center gap-2
    px-5 py-2.5 rounded-xl
    text-sm font-bold tracking-wide text-white

    bg-gradient-to-r from-cyan-500 to-blue-500

    shadow-[0_0_16px_rgba(34,211,238,0.35)]
    hover:shadow-[0_0_26px_rgba(34,211,238,0.55)]

    active:scale-[0.97]
    active:shadow-[0_0_20px_rgba(34,211,238,0.45)]

    transition-all duration-300 ease-out
  "
                    >
                        Your Cart

                        {cartCount > 0 && (
                            <span
                                className="
        absolute -top-2 -right-2
        flex items-center justify-center
        w-6 h-6
        text-xs font-extrabold text-white

        bg-slate-900
        border border-cyan-400/60
        rounded-full

        shadow-[0_0_10px_rgba(34,211,238,0.45)]
      "
                            >
                                {cartCount}
                            </span>
                        )}
                    </Link>

                </div>
            </div>
        </nav>
    );
}

export default NavBar;
