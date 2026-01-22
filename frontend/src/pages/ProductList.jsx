import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/products/")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }
                return response.json();
            })
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 pt-28 flex justify-center items-center text-cyan-300">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 pt-28 flex justify-center items-center text-red-400">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-28">

            {/* Heading */}
            <h1
                className="
                    text-3xl font-extrabold text-center py-6
                    bg-gradient-to-r from-cyan-400 to-blue-500
                    text-transparent bg-clip-text
                    tracking-wide
                "
            >
                Products
            </h1>

            {/* Products Grid */}
            <div
                className="
                    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                    gap-6 px-6 pb-8
                "
            >
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="text-center col-span-full text-cyan-400">
                        No products available
                    </p>
                )}
            </div>
        </div>
    );
}

export default ProductList;
