import api from "../api/axios";

export const getCart = () => api.get("/cart/");
export const addToCart = (product_id, quantity) =>
  api.post("/cart/add/", { product_id, quantity });

export const updateCartItem = (itemId, quantity) =>
  api.patch(`/cart/items/${itemId}/`, { quantity });

export const deleteCartItem = (itemId) =>
  api.delete(`/cart/items/${itemId}/`);

export const clearCartApi = () =>
  api.delete("/cart/clear/");