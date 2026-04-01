import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthHooks";

export default function LoginPage() {
  const { login }    = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const from         = location.state?.from?.pathname || "/";

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email address";
    if (!form.password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.response?.data?.detail || "Invalid email or password";
      setErrors({ api: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left — dark brand panel */}
      <div className="hidden lg:flex flex-col relative bg-dark overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow"/>
        <div className="absolute inset-0 bg-dot-grid bg-dot-md"/>

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link to="/" className="flex items-center gap-2 w-fit mb-auto">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm font-display">T</div>
            <span className="font-display font-extrabold text-lg text-white tracking-tight">
              Tech<span className="text-primary-light">Mart</span>
            </span>
          </Link>

          <div className="my-auto">
            <h2 className="font-display font-extrabold text-4xl text-white leading-tight tracking-tight mb-4">
              Your tech hub,<br/><em className="not-italic text-primary-light">right here.</em>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed max-w-sm mb-8">
              Sign in to track orders, manage your wishlist, and get exclusive deals.
            </p>

            {/* Testimonial */}
            <div className="bg-white/6 border border-white/10 rounded-2xl p-5">
              <div className="flex gap-1 text-warning mb-3">
                {[...Array(5)].map((_,i) => <span key={i}>★</span>)}
              </div>
              <p className="text-white/70 text-sm leading-relaxed italic mb-4">
                "TechMart delivered my MacBook in under 24 hours. Genuine product, great price. I'm a customer for life."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">J</div>
                <div>
                  <p className="text-white text-sm font-semibold">James M.</p>
                  <p className="text-white/40 text-xs">Verified buyer, Nairobi</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-white/20 text-xs mt-auto">© {new Date().getFullYear()} TechMart Electronics</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 bg-surface-2">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <Link to="/" className="flex items-center gap-2 w-fit mb-8 lg:hidden">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm font-display">T</div>
            <span className="font-display font-extrabold text-lg text-dark">Tech<span className="text-primary">Mart</span></span>
          </Link>

          <h1 className="font-display font-extrabold text-3xl text-dark tracking-tight mb-1">
            Welcome back
          </h1>
          <p className="text-[#8B91A8] mb-8">Sign in to your TechMart account</p>

          {/* API error */}
          {errors.api && (
            <div className="flex items-center gap-3 bg-danger/8 border border-danger/20 text-danger rounded-xl px-4 py-3 mb-6 text-sm">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-dark mb-1.5">
                Email address
              </label>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A8] pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <input type="email" name="email" autoComplete="email"
                  value={form.email} onChange={handleChange}
                  placeholder="you@example.com"
                  className={`input-field pl-9 ${errors.email ? "input-error" : ""}`}/>
              </div>
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-dark">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A8] pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <input type={showPw ? "text" : "password"} name="password" autoComplete="current-password"
                  value={form.password} onChange={handleChange}
                  placeholder="Your password"
                  className={`input-field pl-9 pr-10 ${errors.password ? "input-error" : ""}`}/>
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B91A8] hover:text-dark transition-colors">
                  {showPw ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full h-12 text-base">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Signing in…
                </span>
              ) : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-[#8B91A8] mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}