import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function NavBar() {
    const { cartItems } = useCart();
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);


    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center  fixed w-full top-0 z-10">
            <Link to='/' className="text-2xl font-bold text-gray-800 hover:text-blue-600">
            kartZone
            </Link>
            <Link to="/cart" className="relative inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                🛒 Cart
                {cartCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {cartCount}
                    </span>
                )}
            </Link>
            </nav>


    );
}export default NavBar;