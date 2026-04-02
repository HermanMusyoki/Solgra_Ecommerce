import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${slug}/`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(
          data.primary_image || (data.images.length > 0 ? data.images[0].image : null)
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAdd = async () => {
    if (!product.in_stock) return;
    try {
      setAdding(true);
      await addToCart({ product_id: product.id, quantity: 1 });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Main Product Image */}
      {mainImage && (
        <div className="w-full flex justify-center mb-4">
          <img
            src={mainImage}
            alt={product.name}
            className="w-full max-w-4xl max-h-[70vh] rounded object-contain"
          />
        </div>
      )}

      {/* Gallery Thumbnails */}
      {product.images && product.images.length > 0 && (
        <div className="flex gap-2 mt-2 overflow-x-auto mb-4">
          {product.images.map((img) => (
            <img
              key={img.id}
              src={img.image}
              alt={img.alt_text || product.name}
              className={`flex-shrink-0 w-12 sm:w-14 md:w-16 h-auto object-cover rounded cursor-pointer border ${
                mainImage === img.image ? "border-blue-500" : "border-transparent"
              } hover:border-blue-400 transition`}
              onClick={() => setMainImage(img.image)}
              loading="lazy"
            />
          ))}
        </div>
      )}

      {/* Product Info */}
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="text-gray-600 my-2">{product.description}</p>
      <p className="font-bold text-lg">
        Price: KES {product.price}{" "}
        {product.discount_price && (
          <span className="line-through text-gray-500 ml-2">
            KES {product.discount_price}
          </span>
        )}
      </p>
      <p className="text-sm text-gray-700">{product.in_stock ? "In Stock" : "Out of Stock"}</p>

      <button
        onClick={handleAdd}
        disabled={adding || !product.in_stock}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 mt-4 rounded"
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>

      {/* Specifications Table */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <div className="mt-6 max-w-3xl overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-2">Specifications</h2>
          <div className="border rounded divide-y">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex py-2 px-4 bg-gray-50 last:bg-white flex-wrap"
              >
                <span className="font-medium text-gray-700 w-1/3 min-w-[120px]">{key}</span>
                <span className="text-gray-800 w-2/3">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}