import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../context/CartApi";

export default function ProductDetailPage() {
  const dispatch = useDispatch();
  const { slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${slug}/`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const handleAdd = async () => {
    try {
      setAdding(true);
      await dispatch(addToCart({ product_id: slug, quantity: 1 }));
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <img
        src={product.image}
        alt={product.name}
        className="h-60 object-cover w-full mb-4 rounded"
      />

      <h1 className="text-2xl font-bold">{product.name}</h1>

      <p className="text-gray-600 my-2">{product.description}</p>

      <p className="font-bold text-lg">KES {product.price}</p>

      <button
        onClick={handleAdd}
        disabled={adding}
        className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 mt-4 rounded"
      >
        {adding ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}