import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheackoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { clearCart } = useCart();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await authFetch(`${BASEURL}/api/orders/create/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (res.ok) {
                setMessage(" Order placed successfully!");
                clearCart();
                setTimeout(() => navigate("/"), 2000);
            } else {
                setMessage(" Error placing order. Please try again.");
            }
        } catch (error) {
            setMessage(" Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 mt-17">
            <div className="bg-slate-800 w-full max-w-md rounded-xl shadow-xl p-6 border border-white/10">

                {/* Header */}
                <h1 className="text-3xl font-extrabold text-center mb-2 tracking-widest text-2xl font-extrabold tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text hover:from-pink-400 hover:to-indigo-400 transition-all duration-300 text-transparent bg-clip-text">
                    CHECKOUT
                </h1>
                <p className="text-center text-gray-400 text-sm mb-5">
                    Complete your order
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-gray-600 bg-slate-900 
                                   text-gray-100 px-3 py-2 text-sm 
                                   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="karan singh"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                            rows="2"
                            className="w-full rounded-md border border-gray-600 bg-slate-900 
                                   text-gray-100 px-3 py-2 text-sm 
                                   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="House no, Street, City"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-gray-600 bg-slate-900 
                                   text-gray-100 px-3 py-2 text-sm 
                                   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            placeholder="9876543210"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Payment Method
                        </label>
                        <select
                            name="payment_method"
                            value={form.payment_method}
                            onChange={handleChange}
                            className="w-full rounded-md border border-gray-600 bg-slate-900 
                                   text-gray-100 px-3 py-2 text-sm 
                                   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        >
                            <option value="COD">Cash on Delivery</option>
                            <option value="Credit Card">Online Payment</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600
                               hover:from-indigo-700 hover:to-purple-700
                               text-white text-sm font-semibold py-2.5 
                               rounded-md transition disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Place Order"}
                    </button>

                    {message && (
                        <p className="text-center text-sm mt-2 text-green-400">
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );

}

export default CheackoutPage;
