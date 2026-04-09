import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthHooks";

// Dashboard Overview Component
function DashboardOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/api/products/").then(r => r.json()),
      fetch("http://localhost:8000/api/orders/").then(r => r.json()).catch(() => ({ count: 0 })),
    ]).then(([products, orders]) => {
      setStats({
        products: products.count || products.length || 0,
        orders: orders.count || 0,
        users: 0,
        revenue: 0,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Products", value: stats.products, icon: "📦" },
          { label: "Total Orders", value: stats.orders, icon: "📋" },
          { label: "Total Users", value: stats.users, icon: "👥" },
          { label: "Revenue", value: `KES ${stats.revenue.toLocaleString()}`, icon: "💰" },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-dark mt-2">{loading ? "-" : stat.value}</p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Products Management Component
function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/products/")
      .then(r => r.json())
      .then(data => {
        setProducts(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-dark">Products Management</h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="btn-primary px-4 py-2">
          + Add New Product
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No products found</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Product Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-dark">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">KES {product.price}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.stock || 0}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.in_stock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <button
                      onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                      className="text-primary hover:underline">
                      Edit
                    </button>
                    <button className="text-danger hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Orders Management Component
function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/orders/")
      .then(r => r.json())
      .then(data => {
        setOrders(data.results || data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-dark">Orders Management</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No orders found</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-dark">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.user?.email || "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-medium text-dark">KES {order.total}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {order.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                      className="text-primary hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// Product Form Component
// Common specification fields
const COMMON_SPECS = ["processor", "cpu_cores", "ram", "storage", "display", "graphics", "os","touchscreen"];

function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount_price: "",
    stock: "",
    category: "",
    brand: "",
    is_active: true,
    specifications: {},
  });
  const [specKeys, setSpecKeys] = useState(COMMON_SPECS);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Fetch categories and brands
    Promise.all([
      fetch("http://localhost:8000/api/products/categories/").then(r => r.json()),
      fetch("http://localhost:8000/api/products/brands/").then(r => r.json()),
    ]).then(([catsData, brandsData]) => {
      setCategories(catsData.results || catsData);
      setBrands(brandsData.results || brandsData);
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      fetch(`http://localhost:8000/api/products/${id}/`)
        .then(r => r.json())
        .then(data => {
          setForm({
            name: data.name || "",
            description: data.description || "",
            price: data.price || "",
            discount_price: data.discount_price || "",
            stock: data.stock || "",
            category: data.category?.id || data.category || "",
            brand: data.brand?.id || data.brand || "",
            is_active: data.is_active !== false,
            specifications: data.specifications || {},
          });
          // Load existing images
          if (data.images && data.images.length > 0) {
            setPreviewImages(data.images.map(img => ({ url: img.image, alt: img.alt_text })));
          }
        })
        .catch(() => {});
    }
  }, [id, isEdit]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    // Create preview URLs
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, { url: reader.result, file, alt: "" }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImagePreview = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    if (previewImages[index].file) {
      setImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = isEdit ? "PATCH" : "POST";
      const url = isEdit
        ? `http://localhost:8000/api/products/admin/${id}/`
        : "http://localhost:8000/api/products/admin/";

      const specs = {};
      specKeys.forEach(key => {
        if (form.specifications[key] || form.specifications[key] === false) {
          specs[key] = form.specifications[key];
        }
      });

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: form.price,
          discount_price: form.discount_price || null,
          stock: form.stock,
          category: form.category,
          brand: form.brand || null,
          is_active: form.is_active,
          specifications: specs,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrors({ api: JSON.stringify(errorData) });
        setLoading(false);
        return;
      }

      const productData = await response.json();
      const productId = productData.id;

      // Upload images if any
      if (images.length > 0) {
        setUploadingImages(true);
        for (let i = 0; i < images.length; i++) {
          const formData = new FormData();
          formData.append('image', images[i]);
          formData.append('alt_text', previewImages[i]?.alt || '');
          formData.append('is_primary', i === 0);
          formData.append('product', productId);

          await fetch("http://localhost:8000/api/products/images/upload/", {
            method: "POST",
            body: formData,
          });
        }
      }

      navigate("/admin/products");
    } catch (err) {
      setErrors({ api: "Failed to save product" });
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  const addSpecField = () => {
    const newKey = `custom_${Date.now()}`;
    setSpecKeys([...specKeys, newKey]);
  };

  const removeSpecField = (index) => {
    const keyToRemove = specKeys[index];
    const newKeys = specKeys.filter((_, i) => i !== index);
    setSpecKeys(newKeys);

    const newSpecs = { ...form.specifications };
    delete newSpecs[keyToRemove];
    setForm({ ...form, specifications: newSpecs });
  };

  const updateSpecValue = (key, value) => {
    setForm({
      ...form,
      specifications: {
        ...form.specifications,
        [key]: value === "false" ? false : (value === "true" ? true : value),
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/admin/products")} className="text-gray-500 hover:text-dark">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-dark">{isEdit ? "Edit Product" : "Add New Product"}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-8 space-y-6 max-w-3xl">
        {errors.api && (
          <div className="bg-danger/8 border border-danger/20 text-danger rounded-lg px-4 py-3 text-sm">
            {errors.api}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-dark mb-2">Product Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Enter product name"
            className={`input-field ${errors.name ? "input-error" : ""}`}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-dark mb-2">Description *</label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Enter product description"
            rows="4"
            className={`input-field ${errors.description ? "input-error" : ""}`}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Category *</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              className={`input-field ${errors.category ? "input-error" : ""}`}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark mb-2">Brand</label>
            <select
              value={form.brand}
              onChange={e => setForm({ ...form, brand: e.target.value })}
              className="input-field"
            >
              <option value="">Select a brand (optional)</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Price (KES) *</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })}
              placeholder="0"
              className={`input-field ${errors.price ? "input-error" : ""}`}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Discount Price (KES)</label>
            <input
              type="number"
              step="0.01"
              value={form.discount_price}
              onChange={e => setForm({ ...form, discount_price: e.target.value })}
              placeholder="0"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Stock *</label>
            <input
              type="number"
              value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })}
              placeholder="0"
              className="input-field"
              required
            />
          </div>
        </div>

        {/* Active Status */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={e => setForm({ ...form, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-dark">Active</span>
          </label>
        </div>

        {/* Image Upload */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark">Product Images</h3>
            <label className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded transition cursor-pointer">
              + Upload Images
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                disabled={uploadingImages}
              />
            </label>
          </div>

          {previewImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {previewImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-32 object-cover rounded border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImagePreview(index)}
                    className="absolute top-1 right-1 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    ✕
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-1 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {previewImages.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-8 border border-dashed border-gray-300 rounded">
              No images uploaded. Upload images to display product.
            </p>
          )}
        </div>

        {/* Specifications */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-dark">Specifications</h3>
            <button
              type="button"
              onClick={addSpecField}
              className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded transition">
              + Add Custom Field
            </button>
          </div>

          <div className="space-y-3">
            {specKeys.map((key, index) => (
              <div key={index} className="flex gap-2 items-center">
                <label className="w-1/3 text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, " ")}
                </label>

                {key === "touchscreen" ? (
                  <select
                    value={form.specifications[key]?.toString() || ""}
                    onChange={e => updateSpecValue(key, e.target.value)}
                    className="input-field flex-1"
                  >
                    <option value="">Select...</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={form.specifications[key] || ""}
                    onChange={e => updateSpecValue(key, e.target.value)}
                    placeholder={`Enter ${key.replace(/_/g, " ")}`}
                    className="input-field flex-1"
                  />
                )}

                {!COMMON_SPECS.includes(key) && (
                  <button
                    type="button"
                    onClick={() => removeSpecField(index)}
                    className="px-3 py-2 text-danger hover:bg-danger/10 rounded transition">
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className="btn-primary px-6 py-2">
            {loading ? "Saving..." : uploadingImages ? "Uploading images..." : isEdit ? "Update Product" : "Add Product"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-dark font-medium transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// Order Details Component
function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/orders/${id}/`)
      .then(r => r.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading order...</div>;
  if (!order) return <div className="text-center py-8 text-danger">Order not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/admin/orders")} className="text-gray-500 hover:text-dark">
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-dark">Order #{order.id}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-dark mb-4">Order Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Order Date</p>
                <p className="font-medium text-dark">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Status</p>
                <p className="font-medium text-dark">{order.status || "Pending"}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Customer Email</p>
                <p className="font-medium text-dark">{order.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Total Amount</p>
                <p className="font-medium text-dark">KES {order.total}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-dark mb-4">Order Items</h2>
            {order.items && order.items.length > 0 ? (
              <div className="space-y-3">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-dark">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-dark">KES {item.product?.price}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No items in this order</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
          <h2 className="text-lg font-semibold text-dark mb-4">Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-dark">KES {order.subtotal || order.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-dark">KES {order.shipping || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-dark">KES {order.tax || 0}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
              <span className="font-semibold text-dark">Total</span>
              <span className="font-bold text-primary">KES {order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const getCurrentSection = () => {
    if (location.pathname.includes("/products/new") || (location.pathname.includes("/products/") && location.pathname.includes("/edit"))) {
      return "product-form";
    }
    if (location.pathname.includes("/orders/") && !location.pathname.endsWith("/orders")) {
      return "order-details";
    }
    if (location.pathname.includes("/admin/products")) {
      return "products";
    }
    if (location.pathname.includes("/admin/orders")) {
      return "orders";
    }
    return "dashboard";
  };

  const currentSection = getCurrentSection();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
    { id: "products", label: "Products", icon: "📦", path: "/admin/products" },
    { id: "orders", label: "Orders", icon: "📋", path: "/admin/orders" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-20"} bg-dark border-r border-dark-3 transition-all duration-300 fixed h-screen flex flex-col`}>
        <div className="p-4 flex items-center justify-between border-b border-dark-3">
          {sidebarOpen && (
            <h2 className="font-display font-bold text-lg text-white">Admin</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white transition">
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition ${
                currentSection === item.id
                  ? "bg-primary text-white border-l-4 border-primary-light"
                  : "text-gray-400 hover:text-white hover:bg-dark-2"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-dark-3 p-4">
          <div className={`flex items-center gap-2 ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`${sidebarOpen ? "ml-64" : "ml-20"} flex-1 transition-all duration-300`}>
        <div className="p-8">
          {currentSection === "dashboard" && <DashboardOverview />}
          {currentSection === "products" && <ProductsManagement />}
          {currentSection === "product-form" && <ProductForm />}
          {currentSection === "orders" && <OrdersManagement />}
          {currentSection === "order-details" && <OrderDetails />}
        </div>
      </main>
    </div>
  );
}
