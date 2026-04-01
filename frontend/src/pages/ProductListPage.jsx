import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => (
          <div key={p.id} className="border p-4 rounded shadow">
            <img src={p.image} alt={p.name} className="h-40 object-cover w-full" />
            <h2 className="font-bold">{p.name}</h2>
            <p>KES {p.price}</p>

            <Link
              to={`/products/${p.id}`}
              className="text-blue-500"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}