import { useCart } from "../context/CartContext";

function CartPage() {
    const { cartItems, total, removeFromCart, updateQuantity } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    return (
        <div className="min-h-screen bg-gray-100 p-10 mx-3.5 my-8">
            <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <p className="text-lg text-gray-600">Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6"
                            >

                                <div className="flex-items-center gap-4">
                                    {item.product_image && (
                                        <img
                                            src={`${BASEURL}${item.product_image}`}
                                            alt={item.product_name}
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    )
                                    }

                                </div>

                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold">
                                        {item.product_name}
                                    </h2>
                                    <p className="text-gray-600">
                                        Price: ₹{item.product_price}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        className="bg-gray-300 px-3 py-1 rounded text-lg"
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity - 1)
                                        }
                                        disabled={item.quantity === 1}
                                    >
                                        −
                                    </button>

                                    <span className="font-semibold">
                                        {item.quantity}
                                    </span>

                                    <button
                                        className="bg-gray-300 px-3 py-1 rounded text-lg"
                                        onClick={() =>
                                            updateQuantity(item.id, item.quantity + 1)
                                        }
                                    >
                                        +
                                    </button>

                                    <button
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-right">
                        <h2 className="text-2xl font-bold">
                            Total: ₹{total.toFixed(2)}
                        </h2>
                    </div>
                </>
            )}
        </div>
    );
}

export default CartPage;
