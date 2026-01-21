import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const CartContext = createContext();

export function CartProvider({ children }) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

  
    const clearCart = () => {
        setCartItems([]);
        setTotal(0);
    };

    const fetchCart = async () => {
        try {
            const res = await authFetch(`${BASEURL}/api/cart/`);

            if (!res.ok) {
                clearCart();
                return;
            }

            const data = await res.json();
            setCartItems(data.items || []);
            setTotal(data.total || 0);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            fetchCart();
        } else {
            clearCart();
        }
    }, []);


    const addToCart = async (productId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/add/`, {
                method: "POST",
                body: JSON.stringify({ product_id: productId }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };


    const removeFromCart = async (itemId) => {
        try {
            await authFetch(`${BASEURL}/api/cart/remove/`, {
                method: "POST",
                body: JSON.stringify({ item_id: itemId }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };


    const updateQuantity = async (itemId, quantity) => {
        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }

        try {
            await authFetch(`${BASEURL}/api/cart/update/`, {
                method: "POST",
                body: JSON.stringify({ item_id: itemId, quantity }),
            });
            fetchCart();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                total,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
