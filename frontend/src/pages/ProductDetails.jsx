import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function ProductDetails() {
    const { id } = useParams();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const [recommendations, setRecommendations] = useState([]);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);

        fetch(`${BASEURL}/api/products/${id}/`)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch product");
                return res.json();
            })
            .then(data => {
                setProduct(data);
                return fetch(`${BASEURL}/api/recommend/${data.id}/`);
            })
            .then(res => res.json())
            .then(recData => {
                setRecommendations(recData);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [id, BASEURL]);

    if (loading)
        return (
            <div className="min-h-screen bg-slate-900 pt-28 flex items-center justify-center text-cyan-300">
                Loading...
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-slate-900 pt-28 flex items-center justify-center text-red-400">
                Error: {error}
            </div>
        );

    const handleAddToCart = () => {
        if (!localStorage.getItem("access_token")) {
            navigate("/login", {
                state: { message: "Login required! Please login first." },
            });
            return;
        }
        addToCart(product.id);
    };

    const stock = product.available_stock;

    return (
        <div className="min-h-screen bg-slate-900 px-6 pt-28 pb-12">
            <div className="max-w-4xl mx-auto bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-cyan-400/30 shadow-[0_0_35px_rgba(34,211,238,0.25)] flex flex-col md:flex-row gap-8">

                <img
                    className="w-full md:w-1/2 h-80 object-cover rounded-xl border border-cyan-400/20 shadow-[0_0_18px_rgba(34,211,238,0.25)]"
                    src={product.image}
                    alt={product.name}
                />

                <div className="flex-1 text-gray-100">

                    <h2 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                        {product.name}
                    </h2>

                    <p className="text-2xl text-cyan-300 font-semibold mt-3">
                        ₹{product.price}
                    </p>

                    {/*  STOCK DISPLAY */}
                    <p className="mt-2 font-medium">
                        {stock === 0 && (
                            <span className="text-red-400 font-semibold">
                                Out of Stock
                            </span>
                        )}

                        {stock > 0 && stock <= 5 && (
                            <span className="text-yellow-400 font-semibold">
                                Only {stock} left
                            </span>
                        )}

                        {stock > 5 && (
                            <span className="text-green-400">
                                {stock} in stock
                            </span>
                        )}
                    </p>

                    <p className="text-gray-300 mt-4 leading-relaxed">
                        {product.description}
                    </p>

                    <button
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                        className={`
                            mt-6 w-full sm:w-auto
                            px-6 py-3 rounded-xl
                            font-semibold text-white
                            transition-all duration-300
                            ${stock === 0
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_32px_rgba(34,211,238,0.6)] active:scale-[0.97]"
                            }
                        `}
                    >
                        {stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>

                    <div className="mt-4">
                        <Link to="/">
                            <button className="px-6 py-3 rounded-lg text-cyan-300 font-medium bg-slate-900 border border-cyan-400/30 hover:bg-cyan-500/10 active:scale-[0.96] transition-all">
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
