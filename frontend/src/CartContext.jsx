import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

const CartContext = createContext();

const getAuthHeader = () => {
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const normalizeItems = (rawItems = []) =>
  rawItems
    .map((item) => {
      const id = item._id || item.productId || item.product?._id;
      const productId = item.productId || item.product?._id;
      const name = item.product?.name || item.name || "Unnamed";
      const price = item.price ?? item.product?.price ?? 0;
      const imageUrl = item.product?.imageUrl || item.imageUrl || "";

      return {
        ...item,
        id,
        productId,
        name,
        price,
        imageUrl,
        quantity: item.quantity || 0,
      };
    })
    .filter((item) => item.id != null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetchCart();
  }, []);


  useEffect(() => {
    const handler = () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        fetchCart(); 
      } else {
        setCart([]);
      }
    };

    window.addEventListener("authStateChanged", handler);
    return () => window.removeEventListener("authStateChanged", handler);
  }, []);

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/cart", {
        ...getAuthHeader(),
        withCredentials: true,
      });
      const rawItems = Array.isArray(data)
        ? data
        : data.items || data.cart?.items || [];
      setCart(normalizeItems(rawItems));
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    const prevCart = [...cart];

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        { id: productId, productId, quantity, name: "Loading...", price: 0 },
      ];
    });

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/cart",
        { productId, quantity: Number(quantity) },
        getAuthHeader()
      );

      const normalized = normalizeItems([data.item || data])[0];
      setCart((prev) =>
        prev.map((item) =>
          item.productId === normalized.productId ? normalized : item
        )
      );

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
      toast.success(`${normalized.name} added to cart!`);
    } catch (error) {
      setCart(prevCart);
      toast.error("Failed to add to cart");
    }
  };

  const updateQuantity = async (lineId, quantity) => {
    const prevCart = [...cart];
    setCart((prev) =>
      prev.map((item) =>
        item.id === lineId ? { ...item, quantity: Number(quantity) } : item
      )
    );

    try {
      await axios.put(
        `http://localhost:4000/api/cart/${lineId}`,
        { quantity },
        getAuthHeader()
      );
      toast.success("Quantity updated");
    } catch (error) {
      setCart(prevCart);
      toast.error("Failed to update quantity");
    }
  };

  const removeFromCart = async (lineId) => {
    const prevCart = [...cart];
    setCart((prev) => prev.filter((item) => item.id !== lineId));

    try {
      await axios.delete(
        `http://localhost:4000/api/cart/${lineId}`,
        getAuthHeader()
      );
      toast.success("Item removed");
    } catch (error) {
      setCart(prevCart);
      toast.error("Failed to remove item");
    }
  };

  const clearCart = async () => {
    const prevCart = [...cart];
    setCart([]);

    try {
      await axios.post(
        "http://localhost:4000/api/cart/clear",
        {},
        getAuthHeader()
      );
      toast.success("Cart cleared");
    } catch (error) {
      setCart(prevCart);
      toast.error("Failed to clear cart");
    }
  };

  const getCartTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        cartCount,
        updateQuantity,
        removeFromCart,
        clearCart,
        addToCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
