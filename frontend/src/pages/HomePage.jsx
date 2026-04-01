import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to TechStore</h1>
      <p>Your one-stop shop for laptops, phones, and accessories.</p>

      <Link
        to="/products"
        className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Shop Now
      </Link>
    </div>
  );
}