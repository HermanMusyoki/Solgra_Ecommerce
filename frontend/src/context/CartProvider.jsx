import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../api/axios";
import {
  getCart,
  addToCart,
  updateCartItem,
  //deleteCartItem,
  //clearCartApi,
} from "./CartApi";
import { CartContext } from "./CartContext";
import { useAuth } from "./AuthHooks";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [drawerOpen, setDrawer] = useState(false);



  const calculateTotal = (items) =>
  items.reduce(
    (sum, i) => sum + Number(i?.product?.price || 0) * i.quantity,
    0
  );

  const calculateItemCount = (items) =>
  items.reduce((sum, i) => sum + i.quantity, 0);

   const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getCart();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchCart();
    else setItems([]);
  }, [user, fetchCart]);

  
const addItem = async (productId, quantity = 1) => {
    try {
      const { data } = await addToCart(productId, quantity);

      setItems((prev) => {
        const existing = prev.find(i => i.product.id === productId);
        if (existing) {
          return prev.map(i =>
            i.product.id === productId
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, data.item];
      });

      setDrawer(true);
    } catch (err) {
      console.error(err);
    }
  };

   const updateItem = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, quantity);
      setItems(prev =>
        prev.map(i =>
          i.id === itemId ? { ...i, quantity } : i
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    await api.delete(`/cart/items/${itemId}/`);
    await fetchCart();
  };

  // const removeItem = async (itemId) => {
  //   try {
  //     await deleteCartItem(itemId);
  //     setItems(prev => prev.filter(i => i.id !== itemId));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const clearCart = async () => {
    await api.delete("/cart/clear/");
    setItems([]);
  };

  // const clearCart = async () => {
  //   try {
  //     await clearCartApi();
  //     setItems([]);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const total = useMemo(() => calculateTotal(items), [items]);
  const itemCount = useMemo(() => calculateItemCount(items), [items]);

  return (
    <CartContext.Provider value={{
      items, loading, drawerOpen, setDrawer,
      addItem, updateItem, removeItem, clearCart,
      total, itemCount, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}


