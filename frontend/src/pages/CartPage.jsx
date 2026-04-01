import { Link } from "react-router-dom";
import { useCart } from "../context/CartHooks";

export default function CartPage() {
  const { items, removeItem, updateItem, total, itemCount } = useCart();

  const shipping_fee = total >= 5000 ? 0 : 350;
  const grand_total  = total + shipping_fee;

  if (items.length === 0) return (
    <div className="min-h-screen bg-surface-2 flex items-center justify-center">
      <div className="text-center py-20">
        <div className="text-7xl mb-6 opacity-20">🛒</div>
        <h2 className="font-display font-bold text-3xl text-dark mb-3">Your cart is empty</h2>
        <p className="text-[#8B91A8] mb-8 text-lg">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary text-base h-12 px-8">Browse Products</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-dark">Shopping Cart</h1>
            <p className="text-[#8B91A8] mt-1">{itemCount} {itemCount === 1 ? "item" : "items"}</p>
          </div>
          <Link to="/products" className="text-sm text-primary font-semibold hover:underline">
            ← Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Cart items */}
          <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
            <div className="divide-y divide-border-light">
              {items.map((item) => {
                const price = parseFloat(item.product.discount_price || item.product.price);
                return (
                  <div key={item.id} className="flex gap-5 p-5 hover:bg-surface-2/50 transition-colors">
                    {/* Image */}
                    <Link to={`/products/${item.product.slug}`}
                      className="w-24 h-24 rounded-xl bg-surface-2 border border-border-light overflow-hidden shrink-0">
                      {item.product.primary_image
                        ? <img src={item.product.primary_image} alt={item.product.name} className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-3xl opacity-20">📦</div>}
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-[#8B91A8] mb-1">
                        {item.product.brand_name}
                      </p>
                      <Link to={`/products/${item.product.slug}`}
                        className="font-display font-semibold text-dark hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {item.product.name}
                      </Link>

                      <div className="flex items-center justify-between gap-4 mt-4 flex-wrap">
                        {/* Qty */}
                        <div className="flex items-center border border-border rounded-xl overflow-hidden">
                          <button
                            onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                            className="w-9 h-9 flex items-center justify-center bg-surface-2 hover:bg-surface-3 text-dark font-bold text-lg transition-colors">
                            −
                          </button>
                          <span className="min-w-[40px] text-center font-bold text-dark text-sm border-x border-border py-2">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItem(item.id, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center bg-surface-2 hover:bg-surface-3 text-dark font-bold text-lg transition-colors">
                            +
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          {item.product.discount_price && (
                            <p className="text-xs text-[#8B91A8] line-through">
                              KES {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                            </p>
                          )}
                          <p className="font-display font-bold text-lg text-dark">
                            KES {(price * item.quantity).toLocaleString()}
                          </p>
                        </div>

                        {/* Remove */}
                        <button onClick={() => removeItem(item.id)}
                          className="flex items-center gap-1.5 text-xs text-[#8B91A8] hover:text-danger transition-colors font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-border-light p-6 sticky top-24">
            <h2 className="font-display font-bold text-xl text-dark mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm text-[#4A5068]">
                <span>Subtotal ({itemCount} items)</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#4A5068]">
                <span>Shipping</span>
                <span className={shipping_fee === 0 ? "text-success font-semibold" : ""}>
                  {shipping_fee === 0 ? "🎉 Free" : `KES ${shipping_fee.toLocaleString()}`}
                </span>
              </div>

              {shipping_fee > 0 && (
                <div className="bg-primary/5 border border-primary/15 rounded-xl px-3 py-2">
                  <p className="text-xs text-primary font-medium">
                    Add KES {(5000 - total).toLocaleString()} more to get free delivery!
                  </p>
                  <div className="mt-1.5 h-1.5 bg-primary/15 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${Math.min((total/5000)*100,100)}%` }}/>
                  </div>
                </div>
              )}

              <div className="flex justify-between font-display font-bold text-xl text-dark pt-3 border-t border-border-light">
                <span>Total</span>
                <span>KES {grand_total.toLocaleString()}</span>
              </div>
            </div>

            <Link to="/checkout" className="btn-primary w-full justify-center text-base h-12 mb-3">
              Proceed to Checkout →
            </Link>
            <Link to="/products" className="btn-ghost w-full justify-center text-sm">
              Continue Shopping
            </Link>

            {/* Security badges */}
            <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
              {["M-PESA", "Stripe", "PayPal", "Visa"].map((p) => (
                <span key={p} className="px-2 py-1 bg-surface-2 border border-border-light rounded text-[10px] font-bold text-[#8B91A8]">
                  {p}
                </span>
              ))}
            </div>
            <p className="text-center text-xs text-[#8B91A8] mt-2">🔒 Secure checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
