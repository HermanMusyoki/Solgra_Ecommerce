import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1,2,3,4,5].map((s) => (
          <svg key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "text-warning" : "text-border"}`}
            fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      {count !== undefined && <span className="text-[11px] text-[#8B91A8]">({count})</span>}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addItem }      = useCart();
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWish] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock) return;
    setAdding(true);
    try { await addItem(product.id); }
    finally { setTimeout(() => setAdding(false), 600); }
  };

  const discount = product.discount_price
    ? Math.round((1 - product.discount_price / product.price) * 100)
    : null;

  const displayPrice = product.discount_price || product.price;

  return (
    <Link to={`/products/${product.slug}`}
      className="group flex flex-col bg-white border border-border-light rounded-2xl overflow-hidden
                 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:border-border">

      {/* Image */}
      <div className="relative aspect-[4/3] bg-surface-2 overflow-hidden">
        {product.primary_image ? (
          <img src={product.primary_image} alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-20">📦</div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.is_featured && <span className="badge-new">Featured</span>}
          {discount && <span className="badge-sale">-{discount}%</span>}
          {!product.in_stock && <span className="badge-out">Out of Stock</span>}
        </div>

        {/* Wishlist btn */}
        <button onClick={(e) => { e.preventDefault(); setWish(!wishlisted); }}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full
                     border transition-all duration-200 shadow-sm
                     opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100
                     ${wishlisted
                       ? "bg-white border-danger/30 text-danger opacity-100 scale-100"
                       : "bg-white/90 border-border text-[#8B91A8] hover:text-danger hover:border-danger/30"}`}>
          <svg className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"}
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#8B91A8] mb-1">
          {product.brand_name}
        </p>
        <h3 className="font-display font-semibold text-[15px] text-dark leading-snug mb-2 line-clamp-2 flex-1">
          {product.name}
        </h3>

        {/* Rating */}
        {product.avg_rating !== undefined && (
          <div className="mb-2">
            <StarRating rating={product.avg_rating} count={product.review_count}/>
          </div>
        )}

        {/* Spec pills */}
        {product.spec_preview?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.spec_preview.slice(0,3).map((s, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 bg-surface-2 border border-border-light rounded text-[#4A5068] font-medium">
                {s}
              </span>
            ))}
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div>
            {product.discount_price && (
              <p className="text-xs text-[#8B91A8] line-through leading-none mb-0.5">
                KES {parseFloat(product.price).toLocaleString()}
              </p>
            )}
            <p className="font-display font-bold text-lg text-dark leading-none">
              KES {parseFloat(displayPrice).toLocaleString()}
            </p>
          </div>

          <button onClick={handleAdd} disabled={!product.in_stock || adding}
            className={`w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-all duration-150
              ${adding
                ? "bg-success scale-110"
                : product.in_stock
                  ? "bg-primary hover:bg-primary-dark hover:scale-110 hover:shadow-primary-glow active:scale-95"
                  : "bg-surface-3 cursor-not-allowed"}`}>
            {adding ? (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}

export { StarRating };