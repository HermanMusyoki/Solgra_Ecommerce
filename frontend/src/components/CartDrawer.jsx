import { Link } from "react-router-dom";
import { useCart } from "../context/CartHooks";

function QtyBtn({ onClick, children }) {
  return (
    <button onClick={onClick}
      className="w-7 h-7 flex items-center justify-center bg-surface-2 hover:bg-surface-3 border border-border rounded-md text-dark text-sm font-bold transition-colors">
      {children}
    </button>
  );
}

export default function CartDrawer() {
  const { items, drawerOpen, setDrawer, removeItem, updateItem, total, itemCount } = useCart();

  if (!drawerOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setDrawer(false)} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-xl-dark animate-slide-right">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-light shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-xl text-dark">Your Cart</h2>
            {itemCount > 0 && (
              <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button onClick={() => setDrawer(false)}
            className="w-9 h-9 flex items-center justify-center hover:bg-surface-2 rounded-lg transition-colors text-[#8B91A8] hover:text-dark">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-16">
              <div className="text-6xl opacity-20">🛒</div>
              <div>
                <p className="font-display font-bold text-xl text-dark mb-1">Cart is empty</p>
                <p className="text-sm text-[#8B91A8]">Add some electronics to get started</p>
              </div>
              <button onClick={() => setDrawer(false)}
                className="btn-primary mt-2">Browse Products</button>
            </div>
          ) : (
            <div className="space-y-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-border-light last:border-0">
                  <div className="w-20 h-20 rounded-xl bg-surface-2 border border-border-light overflow-hidden shrink-0">
                    {item.product.primary_image ? (
                      <img src={item.product.primary_image} alt={item.product.name}
                        className="w-full h-full object-cover"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">📦</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#8B91A8] mb-0.5">
                      {item.product.brand_name}
                    </p>
                    <p className="text-sm font-semibold text-dark leading-snug line-clamp-2 mb-2">
                      {item.product.name}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      {/* Quantity */}
                      <div className="flex items-center gap-1.5 border border-border rounded-lg overflow-hidden">
                        <QtyBtn onClick={() => item.quantity > 1
                          ? updateItem(item.id, item.quantity - 1)
                          : removeItem(item.id)}>−</QtyBtn>
                        <span className="min-w-[28px] text-center text-sm font-bold text-dark">{item.quantity}</span>
                        <QtyBtn onClick={() => updateItem(item.id, item.quantity + 1)}>+</QtyBtn>
                      </div>

                      <p className="font-display font-bold text-dark">
                        KES {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button onClick={() => removeItem(item.id)}
                    className="self-start mt-1 text-[#8B91A8] hover:text-danger transition-colors p-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-light px-6 py-5 space-y-4 shrink-0">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-[#4A5068]">
                <span>Subtotal</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#4A5068]">
                <span>Shipping</span>
                <span className="text-success font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-display font-bold text-lg text-dark pt-2 border-t border-border-light">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" onClick={() => setDrawer(false)}
              className="btn-primary w-full justify-center text-base h-12">
              Proceed to Checkout →
            </Link>
            <button onClick={() => setDrawer(false)}
              className="btn-ghost w-full justify-center text-sm">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
