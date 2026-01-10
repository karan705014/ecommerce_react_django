import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
    const { id } = useParams();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${BASEURL}/api/products/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch product details");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id, BASEURL]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-10">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-6">

                <img
                    className="w-full md:w-1/2 h-80 object-cover rounded-xl mb-6 md:mb-0 md:float-left md:mr-8 shadow-sm"
                    src={product.image}
                    alt={product.name}
                />

                <h2 className="text-xl md:text-3xl font-bold text-gray-900">
                    {product.name}
                </h2>

                <p className="text-2xl text-green-600 font-semibold mt-3">
                    ₹{product.price}
                </p>

                <p className="text-gray-600 mt-4 leading-relaxed text-base">
                    {product.description}
                </p>

                <button className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3  rounded-lg  font-semibold shadow-md  hover:from-blue-600 hover:to-indigo-700  hover:shadow-lg active:scale-95 transition-all ">
                    🛒 Add to Cart
                </button>
                <div className="mt-4">
                    <a href="/">
                        <button className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:from-green-600 hover:to-emerald-700 hover:shadow-lg active:scale-95 transition-all">
                            ← Back to Home
                        </button>
                    </a>

                </div>


            </div>
        </div>
    );
}

export default ProductDetails;
