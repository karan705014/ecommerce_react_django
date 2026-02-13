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

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // FETCH ADDRESSES
  const fetchAddresses = async () => {
    try {
      const res = await authFetch(`${BASEURL}/api/addresses/`);
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
        if (data.length > 0) setSelectedAddress(data[0].id);
      }
    } catch {
      setAddresses([]);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // ADD ADDRESS
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch(`${BASEURL}/api/addresses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({
          full_name: "",
          address_line: "",
          city: "",
          state: "",
          postal_code: "",
          phone: "",
        });
        fetchAddresses();
      }
    } catch {
      alert("Failed to add address");
    }
  };

  // DELETE ADDRESS
  const handleDelete = async (id) => {
    try {
      await authFetch(`${BASEURL}/api/addresses/${id}/`, {
        method: "DELETE",
      });
      fetchAddresses();
    } catch {
      alert("Delete failed");
    }
  };

  // PLACE ORDER
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      setMessage("Please select address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address_id: selectedAddress,
          payment_method: paymentMethod,
        }),
      });

      if (res.ok) {
        clearCart();
        setShowSuccess(true);

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setMessage("Order failed");
      }
    } catch {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] pt-28 pb-16 flex justify-center relative">

      {/* ===== SUCCESS OVERLAY ===== */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-start justify-center bg-black/60 backdrop-blur-sm z-50 pt-32">
          <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-green-500 rounded-2xl px-10 py-8 shadow-2xl text-center animate-slideDown">

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 flex items-center justify-center bg-green-600 rounded-full text-white text-2xl shadow-lg animate-pop">
                ✓
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white mb-2">
              Order Placed Successfully
            </h2>

            <p className="text-sm text-gray-400">
              Redirecting to homepage...
            </p>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-[#1e293b] rounded-2xl shadow-2xl p-6 border border-[#334155]">

        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Checkout
        </h1>

        {/* ADDRESS SECTION */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium text-gray-300">
              Delivery Address
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="text-cyan-400 text-xs hover:text-cyan-300"
            >
              + Add
            </button>
          </div>

          {addresses.length === 0 && (
            <p className="text-gray-400 text-xs">
              No saved addresses
            </p>
          )}

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => setSelectedAddress(addr.id)}
                className={`p-3 rounded-lg border cursor-pointer transition text-xs ${
                  selectedAddress === addr.id
                    ? "border-cyan-500 bg-[#0f172a]"
                    : "border-[#334155] hover:border-slate-400"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-medium">
                      {addr.full_name}
                    </p>
                    <p className="text-gray-400">
                      {addr.address_line}
                    </p>
                    <p className="text-gray-400">
                      {addr.city}, {addr.state} - {addr.postal_code}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(addr.id);
                    }}
                    className="text-red-400 text-[10px] hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD ADDRESS FORM */}
        {showForm && (
          <form
            onSubmit={handleAddAddress}
            className="bg-[#0f172a] p-4 rounded-lg mb-6 space-y-3 border border-[#334155]"
          >
            {Object.keys(formData).map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key.replace("_", " ").toUpperCase()}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="w-full bg-[#1e293b] p-2 rounded text-xs text-white border border-[#334155]"
                required
              />
            ))}

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 py-2 rounded text-xs font-medium transition"
            >
              Save Address
            </button>
          </form>
        )}

        {/* PAYMENT */}
        <div className="mb-6">
          <label className="block text-xs text-gray-400 mb-2">
            Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full bg-[#0f172a] border border-[#334155] p-2 rounded text-xs text-white"
          >
            <option value="COD">Cash on Delivery</option>
            <option value="ONLINE">Online Payment</option>
          </select>
        </div>

        {/* ORDER BUTTON */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        {message && (
          <p className="text-red-400 text-xs text-center mt-4">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default CheckoutPage;
