import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    return (
        <div className="min-h-screen bg-slate-900 px-6 pt-28 pb-12">

            {/* Heading */}
            <h1
                className="
                    text-3xl font-extrabold tracking-wide mb-8
                    bg-gradient-to-r from-cyan-400 to-blue-500
                    text-transparent bg-clip-text
                "
            >
                Your Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="text-center text-cyan-300 mt-20">
                    Your cart is empty.
                </div>
            ) : (
                <>
                    {/* Cart Items */}
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="
                                    bg-slate-900/80 backdrop-blur-xl
                                    border border-cyan-400/20
                                    rounded-2xl p-5
                                    flex flex-col sm:flex-row items-center gap-6
                                    shadow-[0_0_25px_rgba(34,211,238,0.15)]
                                "
                            >
                                {/* Image */}
                                {item.product_image && (
                                    <img
                                        src={`${BASEURL}${item.product_image}`}
                                        alt={item.product_name}
                                        className="
                                            w-28 h-28 object-cover rounded-xl
                                            border border-cyan-400/20
                                            shadow-[0_0_15px_rgba(34,211,238,0.25)]
                                        "
                                    />
                                )}

                                {/* Info */}
                                <div className="flex-1 text-gray-100">
                                    <h2 className="text-lg font-semibold">
                                        {item.product_name}
                                    </h2>
                                    <p className="text-cyan-300 mt-1">
                                        ₹{item.product_price}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-3">
                                    <button
                                        disabled={item.quantity === 1}
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity - 1)
                                        }
                                        className="
                                            px-3 py-1 rounded-lg
                                            bg-slate-800 text-cyan-300
                                            border border-cyan-400/30
                                            disabled:opacity-40
                                            active:scale-95
                                        "
                                    >
                                        −
                                    </button>

                                    <span className="font-semibold text-white">
                                        {item.quantity}
                                    </span>

                                    <button
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity + 1)
                                        }
                                        className="
                                            px-3 py-1 rounded-lg
                                            bg-slate-800 text-cyan-300
                                            border border-cyan-400/30
                                            active:scale-95
                                        "
                                    >
                                        +
                                    </button>

                                    {/* Remove */}
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="
                                            ml-2 px-3 py-1 rounded-lg
                                            text-red-400
                                            border border-red-400/40
                                            hover:bg-red-500/10
                                            active:scale-95
                                        "
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div
                        className="
                            mt-10 flex flex-col sm:flex-row
                            justify-between items-center gap-6
                            border-t border-cyan-400/20 pt-6
                        "
                    >
                        <h2 className="text-2xl font-bold text-cyan-300">
                            Total: ₹{total.toFixed(2)}
                        </h2>

                        <Link
                            to="/checkout"
                            className="
                                px-8 py-3 rounded-xl font-semibold text-white
                                bg-gradient-to-r from-cyan-500 to-blue-500

                                shadow-[0_0_20px_rgba(34,211,238,0.4)]
                                hover:shadow-[0_0_32px_rgba(34,211,238,0.6)]

                                active:scale-[0.97]
                                transition-all duration-300
                            "
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
