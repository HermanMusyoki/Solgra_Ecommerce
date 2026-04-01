import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthHooks";
import api from "../api/axios";

const STATUS_COLORS = {
  pending:    "bg-warning/10 text-yellow-700",
  paid:       "bg-success/10 text-green-700",
  processing: "bg-primary/10 text-primary",
  shipped:    "bg-info/10 text-sky-700",
  delivered:  "bg-success/10 text-green-700",
  cancelled:  "bg-danger/10 text-danger",
};

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [tab,    setTab]    = useState("orders");
  const [orders, setOrders] = useState([]);
  const [loading,setLoading]= useState(true);
  const [form,   setForm]   = useState({
    first_name: user?.first_name || "",
    last_name:  user?.last_name  || "",
    phone:      user?.phone      || "",
  });
  const [saving, setSaving]   = useState(false);
  const [saved,  setSaved]    = useState(false);

  useEffect(() => {
    api.get("/orders/").then(({data}) => setOrders(data.results||data)).catch(()=>{}).finally(()=>setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/accounts/me/", form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch { alert("Could not save changes."); }
    finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-primary text-white font-display font-bold text-xl flex items-center justify-center">
            {user?.first_name?.[0] || user?.email[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-dark">
              {user?.first_name ? `${user.first_name} ${user.last_name}` : "My Account"}
            </h1>
            <p className="text-sm text-[#8B91A8]">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-border-light rounded-2xl p-1 mb-6 w-fit">
          {["orders","profile","addresses"].map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 h-9 rounded-xl text-sm font-semibold capitalize transition-all
                ${tab===t ? "bg-primary text-white shadow-sm" : "text-[#4A5068] hover:text-dark"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* Orders tab */}
        {tab === "orders" && (
          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_,i) => <div key={i} className="skeleton h-20 rounded-2xl"/>)
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border-light p-12 text-center">
                <div className="text-5xl mb-4 opacity-20">📦</div>
                <h3 className="font-display font-bold text-xl text-dark mb-2">No orders yet</h3>
                <p className="text-[#8B91A8] mb-4">Your order history will appear here</p>
                <Link to="/products" className="btn-primary">Start Shopping</Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-border-light p-5 hover:shadow-card transition-shadow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-display font-bold text-dark">Order #{order.order_number}</p>
                      <p className="text-xs text-[#8B91A8] mt-0.5">{new Date(order.created_at).toLocaleDateString("en-KE",{year:"numeric",month:"long",day:"numeric"})}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[order.status]||"bg-surface-2 text-[#8B91A8]"}`}>
                        {order.status}
                      </span>
                      <span className="font-display font-bold text-dark">
                        KES {parseFloat(order.total_amount).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(order.items||[]).slice(0,4).map((item,i) => (
                      <div key={i} className="w-10 h-10 rounded-lg bg-surface-2 border border-border-light overflow-hidden">
                        {item.product?.primary_image
                          ? <img src={item.product.primary_image} alt="" className="w-full h-full object-cover"/>
                          : <div className="w-full h-full flex items-center justify-center text-xs opacity-30">📦</div>}
                      </div>
                    ))}
                    {(order.items?.length||0) > 4 && (
                      <span className="text-xs text-[#8B91A8]">+{order.items.length-4} more</span>
                    )}
                    <Link to={`/orders/${order.id}`} className="ml-auto text-sm text-primary font-semibold hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Profile tab */}
        {tab === "profile" && (
          <div className="bg-white rounded-2xl border border-border-light p-6">
            <h2 className="font-display font-bold text-lg text-dark mb-5">Personal Information</h2>
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">First Name</label>
                  <input value={form.first_name} onChange={e=>setForm(f=>({...f,first_name:e.target.value}))}
                    className="input-field"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-1.5">Last Name</label>
                  <input value={form.last_name} onChange={e=>setForm(f=>({...f,last_name:e.target.value}))}
                    className="input-field"/>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Email</label>
                <input value={user?.email} disabled className="input-field opacity-50 cursor-not-allowed"/>
                <p className="text-xs text-[#8B91A8] mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Phone</label>
                <input value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))}
                  placeholder="+254 7XX XXX XXX" className="input-field"/>
              </div>
              <button type="submit" disabled={saving}
                className={`btn-primary ${saved ? "bg-success border-success" : ""}`}>
                {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-border-light">
              <h3 className="font-display font-semibold text-dark mb-4">Danger Zone</h3>
              <button onClick={logout}
                className="border border-danger/30 text-danger text-sm font-medium px-4 h-9 rounded-xl hover:bg-danger/5 transition-colors">
                Sign Out of Account
              </button>
            </div>
          </div>
        )}

        {/* Addresses tab */}
        {tab === "addresses" && (
          <div className="bg-white rounded-2xl border border-border-light p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-dark">Saved Addresses</h2>
              <button className="btn-primary btn-sm h-9 px-4 text-sm">+ Add Address</button>
            </div>
            <p className="text-[#8B91A8] text-sm">No saved addresses yet. Addresses saved during checkout will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
