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
                        text-2xl font-extrabold tracking-wider
                        bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400
                        text-transparent bg-clip-text
                    "
                >
                    kartZone
                </Link>


                {/* Center Links */}
                <div className="flex items-center gap-6 text-white">

                    <Link to="/" className="hover:underline">
                        Home
                    </Link>

                    {/* Categories Dropdown */}
                    {/* Categories Dropdown */}
                    <div className="relative group">

                        {/* Trigger */}
                        <span className="cursor-pointer hover:underline text-white">
                            Categories ▾
                        </span>

                        {/* 👇 INVISIBLE HOVER BRIDGE (MOST IMPORTANT LINE) */}
                        <div className="absolute left-0 top-full h-4 w-full"></div>

                        {/* Dropdown */}
                        <div
                            className="
            absolute left-0 top-full mt-4
            hidden group-hover:block
            bg-slate-800 rounded-xl shadow-xl
            border border-white/10
            min-w-[180px]
            z-50
        "
                        >
                            <Link
                                to="/"
                                className="block px-4 py-2 hover:bg-slate-700"
                            >
                                All Products
                            </Link>

                            {categories.map(cat => (
                                <Link
                                    key={cat.id}
                                    to={`/category/${cat.slug}`}
                                    className="block px-4 py-2 hover:bg-slate-700"
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
                            bg-purple-600 text-white font-medium
                            transition-all duration-300
                            hover:bg-purple-700
                            active:scale-95
                            focus:bg-sky-500
                        "
                    >
                        Search
                    </button>
                </form>

                {/* Auth + Cart */}
                <div className="flex items-center gap-6 text-white">

                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className="hover:underline">
                                Login
                            </Link>
                            <Link to="/signup" className="hover:underline">
                                Signup
                            </Link>
                        </>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="hover:underline"
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
                            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                            shadow-[0_0_18px_rgba(168,85,247,0.6)]
                            hover:shadow-[0_0_35px_rgba(236,72,153,0.9)]
                            active:scale-95
                            transition-all duration-300
                        "
                    >
                        Your Cart

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
