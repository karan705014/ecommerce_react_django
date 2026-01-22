import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
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
        setMessage("✅ Order placed successfully!");
        clearCart();
        setTimeout(() => navigate("/"), 1800);
      } else {
        setMessage("❌ Error placing order. Try again.");
      }
    } catch {
      setMessage("⚠ Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4 pt-24">
      <div
        className="
          w-full max-w-md
          bg-slate-900/80 backdrop-blur-xl
          border border-cyan-400/30
          rounded-2xl p-8
          shadow-[0_0_40px_rgba(34,211,238,0.25)]
        "
      >
        {/* Header */}
        <h1
          className="
            text-3xl font-extrabold text-center mb-2
            bg-gradient-to-r from-cyan-400 to-blue-500
            text-transparent bg-clip-text tracking-widest
          "
        >
          CHECKOUT
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          Complete your order details
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Karan Singh"
              className="
                w-full rounded-lg
                bg-slate-800 text-white
                border border-cyan-400/20
                px-3 py-2 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-cyan-400/60
              "
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              rows="2"
              placeholder="House no, Street, City"
              className="
                w-full rounded-lg
                bg-slate-800 text-white
                border border-cyan-400/20
                px-3 py-2 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-cyan-400/60
              "
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="9876543210"
              className="
                w-full rounded-lg
                bg-slate-800 text-white
                border border-cyan-400/20
                px-3 py-2 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-cyan-400/60
              "
            />
          </div>

          {/* Payment */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              className="
                w-full rounded-lg
                bg-slate-800 text-white
                border border-cyan-400/20
                px-3 py-2 text-sm
                focus:outline-none
                focus:ring-2 focus:ring-cyan-400/60
              "
            >
              <option value="COD">Cash on Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full mt-4 py-3 rounded-xl
              font-bold text-white
              bg-gradient-to-r from-cyan-500 to-blue-500
              shadow-[0_0_20px_rgba(34,211,238,0.4)]
              hover:shadow-[0_0_32px_rgba(34,211,238,0.6)]
              active:scale-[0.97]
              transition-all duration-300
              disabled:opacity-50
            "
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

          {message && (
            <p className="text-center text-sm mt-3 text-cyan-300 font-semibold">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
