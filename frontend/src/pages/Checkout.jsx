import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartHooks";
import { useAuth } from "../context/AuthHooks";
import api from "../api/axios";

const STEPS = ["Cart", "Shipping", "Payment", "Confirm"];
const COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Malindi","Kitale","Garissa","Kakamega"];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState({});
  const [orderId, setOrderId] = useState(null);

  const [shipping, setShipping] = useState({
    full_name: `${user?.first_name||""} ${user?.last_name||""}`.trim(),
    phone:        user?.phone || "",
    address_line1:"",
    address_line2:"",
    city:         "",
    county:       "Nairobi",
    country:      "Kenya",
  });

  const [payment, setPayment] = useState({
    method: "mpesa",
    mpesa_phone: user?.phone || "",
    card_number: "", card_expiry: "", card_cvv: "", card_name: "",
  });

  const shipping_fee = total >= 5000 ? 0 : 350;
  const grand_total  = total + shipping_fee;

  const validateShipping = () => {
    const e = {};
    if (!shipping.full_name)    e.full_name    = "Required";
    if (!shipping.phone)        e.phone        = "Required";
    if (!shipping.address_line1)e.address_line1= "Required";
    if (!shipping.city)         e.city         = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (payment.method === "mpesa" && !payment.mpesa_phone) e.mpesa_phone = "Required";
    if (payment.method === "stripe") {
      if (!payment.card_number) e.card_number = "Required";
      if (!payment.card_expiry) e.card_expiry = "Required";
      if (!payment.card_cvv)    e.card_cvv    = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validatePayment()) return;
    setLoading(true);
    try {
      const payload = {
        shipping_address: shipping,
        payment_method:   payment.method,
        items: items.map(i => ({ product: i.product.id, quantity: i.quantity, price: i.product.price })),
        total_amount: grand_total,
        ...(payment.method === "mpesa" ? { mpesa_phone: payment.mpesa_phone } : {}),
      };
      const { data } = await api.post("/orders/", payload);
      setOrderId(data.order_number);
      await clearCart();
      setStep(3);
    } catch (err) {
      setErrors({ api: err.response?.data?.detail || "Order failed. Please try again." });
    } finally { setLoading(false); }
  };

  if (items.length === 0 && !orderId) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-2">
      <div className="text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display font-bold text-2xl mb-2">Your cart is empty</h2>
        <p className="text-[#8B91A8] mb-6">Add products before checking out</p>
        <Link to="/products" className="btn-primary">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white font-black text-xs">T</div>
            <span className="font-display font-bold text-dark">Tech<span className="text-primary">Mart</span></span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-0">
            {STEPS.slice(0, step===3 ? 4 : 3).map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={`flex items-center gap-2 ${i > 0 ? "" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                    ${i < step ? "bg-primary text-white" : i === step-1 ? "bg-primary text-white" : "bg-border text-[#8B91A8]"}`}>
                    {i < step-1 ? "✓" : i+1}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block ${i === step-1 ? "text-primary" : "text-[#8B91A8]"}`}>
                    {s}
                  </span>
                </div>
                {i < 2 && <div className={`w-8 h-px mx-2 ${i < step-1 ? "bg-primary" : "bg-border"}`}/>}
              </div>
            ))}
          </div>
        </div>

        {/* Success screen */}
        {step === 3 ? (
          <div className="max-w-lg mx-auto text-center py-20">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-fade-up">
              ✅
            </div>
            <h1 className="font-display font-extrabold text-3xl text-dark mb-3">Order Placed!</h1>
            <p className="text-[#8B91A8] mb-2">Thank you for shopping with TechMart.</p>
            <p className="text-dark font-semibold mb-8">Order #{orderId}</p>
            <p className="text-sm text-[#8B91A8] mb-8">
              You'll receive a confirmation email shortly. {payment.method === "mpesa" && "Please complete your M-Pesa payment from your phone."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/orders" className="btn-primary">Track My Order</Link>
              <Link to="/products" className="btn-secondary">Continue Shopping</Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">

            {/* Left — form */}
            <div className="space-y-5">

              {/* Step 1 — Shipping */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-5 border-b border-border-light">
                    <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <h2 className="font-display font-bold text-lg text-dark">Shipping Details</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {errors.api && <div className="bg-danger/8 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3">⚠️ {errors.api}</div>}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Full Name</label>
                        <input value={shipping.full_name} onChange={e=>setShipping(s=>({...s,full_name:e.target.value}))}
                          placeholder="John Doe" className={`input-field ${errors.full_name?"input-error":""}`}/>
                        {errors.full_name && <p className="text-xs text-danger mt-1">{errors.full_name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">Phone Number</label>
                        <input value={shipping.phone} onChange={e=>setShipping(s=>({...s,phone:e.target.value}))}
                          placeholder="+254 7XX XXX XXX" className={`input-field ${errors.phone?"input-error":""}`}/>
                        {errors.phone && <p className="text-xs text-danger mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Address Line 1</label>
                      <input value={shipping.address_line1} onChange={e=>setShipping(s=>({...s,address_line1:e.target.value}))}
                        placeholder="Street address, building name" className={`input-field ${errors.address_line1?"input-error":""}`}/>
                      {errors.address_line1 && <p className="text-xs text-danger mt-1">{errors.address_line1}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark mb-1.5">Address Line 2 <span className="text-[#8B91A8] font-normal">(optional)</span></label>
                      <input value={shipping.address_line2} onChange={e=>setShipping(s=>({...s,address_line2:e.target.value}))}
                        placeholder="Apartment, floor, etc." className="input-field"/>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">City / Town</label>
                        <input value={shipping.city} onChange={e=>setShipping(s=>({...s,city:e.target.value}))}
                          placeholder="Nairobi" className={`input-field ${errors.city?"input-error":""}`}/>
                        {errors.city && <p className="text-xs text-danger mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">County</label>
                        <select value={shipping.county} onChange={e=>setShipping(s=>({...s,county:e.target.value}))}
                          className="input-field">
                          {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <button onClick={() => { if(validateShipping()) setStep(2); }}
                      className="btn-primary w-full h-12 text-base mt-2">
                      Continue to Payment →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2 — Payment */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
                  <div className="flex items-center gap-3 px-6 py-5 border-b border-border-light">
                    <div className="w-7 h-7 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <h2 className="font-display font-bold text-lg text-dark">Payment Method</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {errors.api && <div className="bg-danger/8 border border-danger/20 text-danger text-sm rounded-xl px-4 py-3">⚠️ {errors.api}</div>}

                    {/* Payment options */}
                    <div className="space-y-3">
                      {[
                        { id:"mpesa",  label:"M-Pesa",   icon:"📱", desc:"Pay via M-Pesa STK Push" },
                        { id:"stripe", label:"Card",     icon:"💳", desc:"Visa, Mastercard, Amex" },
                        { id:"paypal", label:"PayPal",   icon:"🅿️", desc:"Pay with your PayPal account" },
                      ].map((m) => (
                        <label key={m.id}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                            ${payment.method===m.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                          <input type="radio" name="payment" value={m.id}
                            checked={payment.method===m.id}
                            onChange={() => setPayment(p=>({...p,method:m.id}))}
                            className="accent-primary"/>
                          <span className="text-2xl">{m.icon}</span>
                          <div>
                            <p className="font-semibold text-dark text-sm">{m.label}</p>
                            <p className="text-xs text-[#8B91A8]">{m.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* M-Pesa fields */}
                    {payment.method === "mpesa" && (
                      <div>
                        <label className="block text-sm font-medium text-dark mb-1.5">M-Pesa Phone Number</label>
                        <input value={payment.mpesa_phone}
                          onChange={e=>setPayment(p=>({...p,mpesa_phone:e.target.value}))}
                          placeholder="+254 7XX XXX XXX"
                          className={`input-field ${errors.mpesa_phone?"input-error":""}`}/>
                        {errors.mpesa_phone && <p className="text-xs text-danger mt-1">{errors.mpesa_phone}</p>}
                        <p className="text-xs text-[#8B91A8] mt-2">
                          You'll receive an STK Push prompt on this number to complete payment.
                        </p>
                      </div>
                    )}

                    {/* Stripe card fields */}
                    {payment.method === "stripe" && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1.5">Cardholder Name</label>
                          <input value={payment.card_name}
                            onChange={e=>setPayment(p=>({...p,card_name:e.target.value}))}
                            placeholder="John Doe" className="input-field"/>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-dark mb-1.5">Card Number</label>
                          <input value={payment.card_number}
                            onChange={e=>setPayment(p=>({...p,card_number:e.target.value.replace(/\D/g,"").slice(0,16)}))}
                            placeholder="1234 5678 9012 3456"
                            className={`input-field font-mono ${errors.card_number?"input-error":""}`}/>
                          {errors.card_number && <p className="text-xs text-danger mt-1">{errors.card_number}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-dark mb-1.5">Expiry</label>
                            <input value={payment.card_expiry}
                              onChange={e=>setPayment(p=>({...p,card_expiry:e.target.value}))}
                              placeholder="MM / YY"
                              className={`input-field font-mono ${errors.card_expiry?"input-error":""}`}/>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-dark mb-1.5">CVV</label>
                            <input value={payment.card_cvv} type="password" maxLength={4}
                              onChange={e=>setPayment(p=>({...p,card_cvv:e.target.value.replace(/\D/g,"").slice(0,4)}))}
                              placeholder="•••"
                              className={`input-field font-mono ${errors.card_cvv?"input-error":""}`}/>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-2">
                      <button onClick={() => setStep(1)} className="btn-secondary flex-1 h-12">← Back</button>
                      <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 h-12 text-base">
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            Placing order…
                          </span>
                        ) : "Place Order →"}
                      </button>
                    </div>

                    <p className="flex items-center justify-center gap-2 text-xs text-[#8B91A8]">
                      🔒 Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right — order summary */}
            <div className="bg-white rounded-2xl border border-border-light p-6 sticky top-24">
              <h3 className="font-display font-bold text-lg text-dark mb-5 pb-4 border-b border-border-light">
                Order Summary
              </h3>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-surface-2 border border-border-light overflow-hidden shrink-0">
                      {item.product.primary_image
                        ? <img src={item.product.primary_image} alt="" className="w-full h-full object-cover"/>
                        : <div className="w-full h-full flex items-center justify-center text-lg opacity-20">📦</div>}
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-dark line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-[#8B91A8]">{item.product.brand_name}</p>
                    </div>
                    <p className="font-display font-bold text-sm text-dark shrink-0">
                      KES {(parseFloat(item.product.price)*item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-border-light">
                <div className="flex justify-between text-sm text-[#4A5068]">
                  <span>Subtotal</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-[#4A5068]">
                  <span>Shipping</span>
                  <span className={shipping_fee === 0 ? "text-success font-medium" : ""}>
                    {shipping_fee === 0 ? "Free" : `KES ${shipping_fee.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg text-dark pt-3 border-t border-border-light">
                  <span>Total</span>
                  <span>KES {grand_total.toLocaleString()}</span>
                </div>
              </div>

              {shipping_fee > 0 && (
                <p className="text-xs text-[#8B91A8] mt-3 text-center">
                  Add KES {(5000-total).toLocaleString()} more for free delivery
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}