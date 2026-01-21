import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${BASEURL}/api/products/${id}/`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch product");
                return res.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, BASEURL]);

    if (loading)
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-gray-300 pt-24">
                Loading...
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center text-red-400 pt-24">
                Error: {error}
            </div>
        );
    const handleAddToCart = () => {
        if (!localStorage.getItem("access_token")) {
            navigate("/login", {
                state: {
                    message: "Login Required ! Login First"
                }
            });
            return;
        }

        addToCart(product.id);

    }

    return (
        <div className="min-h-screen bg-slate-900 px-6 pt-24 pb-10">
            <div className="max-w-4xl mx-auto bg-slate-800 rounded-xl shadow-xl p-6
                            flex flex-col md:flex-row gap-8 border border-white/10">

                <img
                    className="w-full md:w-1/2 h-80 object-cover rounded-xl shadow-md"
                    src={product.image}
                    alt={product.name}
                />

                <div className="flex-1 text-gray-100">
                    <h2 className="text-3xl font-extrabold tracking-wide">
                        {product.name}
                    </h2>

                    <p className="text-2xl text-emerald-400 font-semibold mt-3">
                        ₹{product.price}
                    </p>

                    <p className="text-gray-300 mt-4 leading-relaxed">
                        {product.description}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        className="
                            mt-6 w-full sm:w-auto
                            bg-gradient-to-r from-indigo-600 to-purple-600
                            text-white px-6 py-3 rounded-lg font-semibold
                            shadow-md hover:from-indigo-700 hover:to-purple-700
                            hover:shadow-lg active:scale-95 transition-all
                        "
                    >
                         Add to Cart
                    </button>

                    <div className="mt-4">
                        <Link to="/">
                            <button
                                className="
                                    bg-slate-700 text-gray-200
                                    px-6 py-3 rounded-lg font-semibold
                                    hover:bg-slate-600
                                    transition
                                "
                            >
                                ← Back to Home
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
