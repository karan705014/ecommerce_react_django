import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";

function Home() {
    // category slug from url (/category/:slug)
    const { slug } = useParams();

    // used to read search query from url (?search=...)
    const location = useLocation();

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    // search keyword from query params
    const searchQuery = new URLSearchParams(location.search).get("search");

    // product list state
    const [products, setProducts] = useState([]);

    // loading & error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // sorting state
    const [ordering, setOrdering] = useState("");

    // reset page when filter/search/sort changes
    useEffect(() => {
        setPage(1);
    }, [slug, searchQuery, ordering]);

    // fetch products from backend
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
            <div className="min-h-screen bg-slate-900 pt-24 flex justify-center items-center text-gray-300">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-900 pt-24 flex justify-center items-center text-red-400">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-900 pt-24">

            {/* Sorting dropdown */}
            <div className="flex justify-end px-6 my-4">
                <select
                    value={ordering}
                    onChange={(e) => setOrdering(e.target.value)}
                    className="px-4 py-2 rounded bg-slate-800 text-white border border-white/20"
                >
                    <option value="">Sort By</option>
                    <option value="price">Price : Low → High</option>
                    <option value="-price">Price : High → Low</option>
                    <option value="-created_at">Newest</option>
                </select>
            </div>

            {/* Products grid */}
            <div className="
                grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
                gap-6 p-6
            ">
                {products.length > 0 ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-400">
                        No products found
                    </p>
                )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 py-8 text-white">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
                >
                    Prev
                </button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 bg-slate-700 rounded disabled:opacity-40"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

export default Home;
