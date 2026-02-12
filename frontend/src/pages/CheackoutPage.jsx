import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";

function CheckoutPage() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await authFetch(`${BASEURL}/api/addresses/`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddress(data[0].id);
        }
      }
    } catch {
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Redirect effect
  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [showBanner, navigate]);

  // Place order
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      setMessage("Please select a delivery address.");
      return;
    }

    setLoading(true);

    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_id: selectedAddress,
          payment_method: paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Order failed.");
      } else {
        clearCart();
        setMessage(" Order placed successfully!");
        setShowBanner(true);
      }

    } catch {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-4 pt-24">

      {/*  TOP SUCCESS BANNER */}
      {showBanner && (
        <div className="fixed top-6 bg-slate-800 border border-green-500 text-green-400 px-6 py-3 rounded-xl shadow-2xl backdrop-blur-md animate-fade-in z-50">
          <div className="flex items-center gap-2">
            <span className="text-lg">✔</span>
            <span className="font-medium">{message}</span>
          </div>
        </div>
      )}


      {/*  ERROR MESSAGE */}
      {!showBanner && message && (
        <div className="mb-4 text-red-400 text-sm text-center">
          {message}
        </div>
      )}

      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-8">

        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Checkout
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-400 mb-3">
              Delivery Address
            </label>

            {addresses.length === 0 ? (
              <p className="text-sm text-gray-400">No saved addresses.</p>
            ) : (
              addresses.map(addr => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`p-3 mb-3 rounded border cursor-pointer ${selectedAddress === addr.id
                    ? "border-cyan-500"
                    : "border-slate-700"
                    }`}
                >
                  <p className="text-white font-medium">{addr.full_name}</p>
                  <p className="text-sm text-gray-400">{addr.address_line}</p>
                  <p className="text-sm text-gray-400">
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                  <p className="text-sm text-gray-400">{addr.phone}</p>
                </div>
              ))
            )}
          </div>

          {/* Payment */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-800 p-2 rounded text-white"
            >
              <option value="COD">Cash on Delivery</option>
              <option value="ONLINE">Online Payment</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 py-3 rounded text-white font-medium disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CheckoutPage;
