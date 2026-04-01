// ─── WishlistPage ────────────────────────────────────────────
import { Link } from "react-router-dom";

export function WishlistPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <div className="text-center py-20">
        <div className="text-7xl mb-6 opacity-20">❤️</div>
        <h2 className="font-display font-bold text-3xl text-dark mb-3">Your Wishlist</h2>
        <p className="text-[#8B91A8] mb-8">Save your favourite products here while you browse.</p>
        <Link to="/products" className="btn-primary text-base h-12 px-8">Browse Products</Link>
      </div>
    </div>
  );
}

// ─── OrderDetailPage ─────────────────────────────────────────
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const STATUS_STEPS = ["pending", "paid", "processing", "shipped", "delivered"];
const STATUS_COLORS = {
  pending:    "bg-warning/10 text-yellow-700",
  paid:       "bg-success/10 text-green-700",
  processing: "bg-primary/10 text-primary",
  shipped:    "bg-sky-50 text-sky-700",
  delivered:  "bg-success/10 text-green-700",
  cancelled:  "bg-danger/10 text-danger",
};

export function OrderDetailPage() {
  const { id } = useParams();
  const [order,   setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}/`)
      .then(({ data }) => setOrder(data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-border border-t-primary rounded-full animate-spin"/>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center text-center">
      <div>
        <div className="text-5xl mb-4 opacity-20">📦</div>
        <h2 className="font-display font-bold text-2xl text-dark mb-2">Order not found</h2>
        <Link to="/profile" className="btn-primary mt-4">Back to Orders</Link>
      </div>
    </div>
  );

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex items-center gap-3 mb-8">
          <Link to="/profile" className="text-sm text-[#8B91A8] hover:text-primary transition-colors">
            ← My Orders
          </Link>
          <span className="text-[#8B91A8]">/</span>
          <span className="text-sm font-semibold text-dark">#{order.order_number}</span>
        </div>

        <div className="grid md:grid-cols-[1fr_300px] gap-6 items-start">
          <div className="space-y-5">

            {/* Status tracker */}
            <div className="bg-white rounded-2xl border border-border-light p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg text-dark">Order Status</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[order.status] || "bg-surface-2 text-[#8B91A8]"}`}>
                  {order.status}
                </span>
              </div>

              {order.status !== "cancelled" && (
                <div className="flex items-center justify-between">
                  {STATUS_STEPS.map((step, i) => (
                    <div key={step} className="flex flex-col items-center flex-1 relative">
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${i < currentStep ? "bg-primary" : "bg-border"}`}/>
                      )}
                      <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center relative z-10 text-xs font-bold transition-all
                        ${i <= currentStep ? "bg-primary border-primary text-white" : "bg-white border-border text-[#8B91A8]"}`}>
                        {i < currentStep ? "✓" : i + 1}
                      </div>
                      <span className="text-[10px] font-medium capitalize mt-1.5 text-center text-[#8B91A8]">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order items */}
            <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
              <div className="px-5 py-4 border-b border-border-light">
                <h3 className="font-display font-bold text-dark">Items Ordered</h3>
              </div>
              <div className="divide-y divide-border-light">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-14 h-14 rounded-xl bg-surface-2 border border-border-light overflow-hidden shrink-0">
                      {item.product?.primary_image
                        ? <img src={item.product.primary_image} alt="" className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-xl opacity-20">📦</div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-dark text-sm line-clamp-1">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-[#8B91A8]">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-display font-bold text-dark text-sm">
                      KES {(parseFloat(item.price) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping address */}
            <div className="bg-white rounded-2xl border border-border-light p-5">
              <h3 className="font-display font-bold text-dark mb-3">Delivery Address</h3>
              <div className="text-sm text-[#4A5068] space-y-1">
                <p className="font-semibold text-dark">{order.shipping_address?.full_name}</p>
                <p>{order.shipping_address?.address_line1}</p>
                {order.shipping_address?.address_line2 && <p>{order.shipping_address.address_line2}</p>}
                <p>{order.shipping_address?.city}, {order.shipping_address?.county}</p>
                <p>{order.shipping_address?.phone}</p>
              </div>
            </div>
          </div>

          {/* Summary sidebar */}
          <div className="bg-white rounded-2xl border border-border-light p-5 sticky top-24">
            <h3 className="font-display font-bold text-dark mb-4">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#4A5068]">
                <span>Order #</span>
                <span className="font-mono font-semibold text-dark">{order.order_number}</span>
              </div>
              <div className="flex justify-between text-[#4A5068]">
                <span>Date</span>
                <span>{new Date(order.created_at).toLocaleDateString("en-KE")}</span>
              </div>
              <div className="flex justify-between text-[#4A5068]">
                <span>Payment</span>
                <span className="capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg text-dark pt-3 border-t border-border-light mt-3">
                <span>Total</span>
                <span>KES {parseFloat(order.total_amount).toLocaleString()}</span>
              </div>
            </div>

            <Link to="/products" className="btn-primary w-full justify-center mt-5 h-10 text-sm">
              Shop Again
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NotFoundPage ─────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <div className="text-center py-20 px-4">
        <p className="font-display font-extrabold text-[8rem] leading-none text-dark/8 mb-4">404</p>
        <h1 className="font-display font-extrabold text-4xl text-dark mb-3">Page Not Found</h1>
        <p className="text-[#8B91A8] text-lg mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/"        className="btn-primary text-base h-12 px-8">Go Home</Link>
          <Link to="/products" className="btn-secondary text-base h-12 px-8">Browse Products</Link>
        </div>
      </div>
    </div>
  );
}