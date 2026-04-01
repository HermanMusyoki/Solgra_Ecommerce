import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/api"; //axios instance

// Fetch cart from backend
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const res = await API.get("/cart/");
  return res.data; // expected: array of cart items
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product_id, quantity } = action.payload;
      const existing = state.items.find(item => item.product_id === product_id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ product_id, quantity });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.product_id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
