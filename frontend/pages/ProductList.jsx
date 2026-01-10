import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx"

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/products/')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch  ");
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
            })
    }, []);
    if(loading){
        return <div>loading......</div>
    }
    if (error){
        return <div>Error:{error}</div>
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <h1 className="text-3xl font-bold text-center py-6 bg-white shadow-md">ProductList</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {products.length>0 ? (
                    products.map((product)=>(
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                   <p className="text-center col-span-full">no card available</p> 
                )
            }

            </div>
        </div>
    )


}
export default ProductList;