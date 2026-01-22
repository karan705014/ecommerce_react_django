import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

function Home() {
    const { slug } = useParams();
    const location = useLocation();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const searchQuery = new URLSearchParams(location.search).get("search");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [ordering, setOrdering] = useState("");

    useEffect(() => {
        setPage(1);
    }, [slug, searchQuery, ordering]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        let url = `${BASEURL}/api/products/?page=${page}&`;
        if (slug) url += `category=${slug}&`;
        if (searchQuery) url += `search=${searchQuery}&`;
        if (ordering) url += `ordering=${ordering}&`;

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch products");
                return res.json();
            })
            .then(data => {
                setProducts(data.results);
                setTotalPages(data.total_pages);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [slug, searchQuery, page, ordering, BASEURL]);

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
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-28">

            {/* SORT BAR */}
            <div className="flex justify-end px-6 my-6">
                <select
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                    className="
                        px-4 py-2 rounded-lg
                        bg-slate-900 text-cyan-300
                        border border-cyan-400/30
                        focus:outline-none
                        focus:ring-2 focus:ring-cyan-400/50
                        transition
                    "
                >
                    <option value="">Sort By</option>
                    <option value="price">Price : Low → High</option>
                    <option value="-price">Price : High → Low</option>
                    <option value="-created_at">Newest</option>
                </select>
            </div>

            {/* PRODUCTS GRID */}
            <div
                className="
                    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                    gap-6 px-6 pb-6
                "
            >
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-cyan-400">
                        No products found
                    </p>
                )}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center items-center gap-6 py-10 text-cyan-300">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="
                        px-4 py-2 rounded-lg
                        bg-slate-900
                        border border-cyan-400/30
                        hover:bg-cyan-500/10
                        disabled:opacity-40
                        transition
                    "
                >
                    Prev
                </button>

                <span className="text-sm tracking-wide">
                    Page <span className="text-cyan-200 font-semibold">{page}</span>
                    {" "}of{" "}
                    <span className="text-cyan-200 font-semibold">{totalPages}</span>
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="
                        px-4 py-2 rounded-lg
                        bg-slate-900
                        border border-cyan-400/30
                        hover:bg-cyan-500/10
                        disabled:opacity-40
                        transition
                    "
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
