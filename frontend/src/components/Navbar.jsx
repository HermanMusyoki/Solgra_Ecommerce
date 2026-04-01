import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthHooks";
import { useCart } from "../context/CartHooks";

const CATEGORIES = [
  { label: "Laptops",    emoji: "💻", slug: "laptops" },
  { label: "Desktops",   emoji: "🖥️", slug: "desktops" },
  { label: "iPhones",    emoji: "📱", slug: "iphones" },
  { label: "Android",    emoji: "📲", slug: "android" },
  { label: "Printers",   emoji: "🖨️", slug: "printers" },
  { label: "Accessories",emoji: "🎧", slug: "accessories" },
];

export default function Navbar() {
  const { user, logout }    = useAuth();
  const { itemCount, setDrawer } = useCart();
  const navigate            = useNavigate();
  const [query, setQuery]   = useState("");
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobile]   = useState(false);
  const [userMenu, setUserMenu]   = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setMobile(false);
    }
  };

  const handleLogout = () => { logout(); setUserMenu(false); navigate("/"); };

  return (
    <>
      {/* Promo bar */}
      <div className="bg-primary text-white text-xs font-medium text-center py-2 px-4 relative z-50">
        🚀 Free shipping on orders over KES 5,000 —{" "}
        <Link to="/products" className="underline font-bold hover:opacity-80">Shop Now</Link>
      </div>

      {/* Main navbar */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-card border-b border-border-light"
          : "bg-white border-b border-border-light"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm font-display group-hover:scale-105 transition-transform">
                T
              </div>
              <span className="font-display font-extrabold text-lg text-dark tracking-tight">
                Tech<span className="text-primary">Mart</span>
              </span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg relative">
              <div className="relative w-full">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A8] pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"/>
                </svg>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search laptops, phones, accessories…"
                  className="w-full h-10 pl-9 pr-16 bg-surface-2 border border-border rounded-full text-sm outline-none
                             focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all placeholder:text-[#8B91A8]"
                />
                <button type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3 bg-primary text-white text-xs font-semibold rounded-full hover:bg-primary-dark transition-colors">
                  Search
                </button>
              </div>
            </form>

            {/* Nav links — desktop */}
            <nav className="hidden lg:flex items-center gap-1">
              {CATEGORIES.slice(0,3).map((c) => (
                <NavLink key={c.slug} to={`/products?category=${c.slug}`}
                  className={({ isActive }) =>
                    `text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      isActive ? "text-primary bg-primary/8" : "text-[#4A5068] hover:text-dark hover:bg-surface-2"
                    }`}>
                  {c.label}
                </NavLink>
              ))}
              <NavLink to="/products"
                className={({ isActive }) =>
                  `text-sm font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    isActive ? "text-primary bg-primary/8" : "text-[#4A5068] hover:text-dark hover:bg-surface-2"
                  }`}>
                All Products
              </NavLink>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Wishlist */}
              <Link to="/wishlist"
                className="hidden sm:flex w-10 h-10 items-center justify-center text-[#4A5068] hover:text-dark hover:bg-surface-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
              </Link>

              {/* Cart */}
              <button onClick={() => setDrawer(true)}
                className="relative w-10 h-10 flex items-center justify-center text-[#4A5068] hover:text-dark hover:bg-surface-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m5-9v9m4-9v9m4-9l2 9"/>
                </svg>
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-accent text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* User menu */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenu(!userMenu)}
                    className="flex items-center gap-2 pl-2 pr-3 h-9 border border-border rounded-full hover:border-primary hover:bg-primary/5 transition-all">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                      {user.first_name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-dark max-w-[80px] truncate">
                      {user.first_name || user.email.split("@")[0]}
                    </span>
                    <svg className={`w-3.5 h-3.5 text-[#8B91A8] transition-transform ${userMenu ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border-light rounded-xl shadow-card-hover z-50 overflow-hidden animate-fade-in">
                      <div className="px-4 py-3 border-b border-border-light">
                        <p className="text-sm font-semibold text-dark">{user.first_name} {user.last_name}</p>
                        <p className="text-xs text-[#8B91A8] truncate">{user.email}</p>
                      </div>
                      {[
                        { to: "/profile",   label: "My Profile",  icon: "👤" },
                        { to: "/orders",    label: "My Orders",   icon: "📦" },
                        { to: "/wishlist",  label: "Wishlist",    icon: "❤️"  },
                      ].map((item) => (
                        <Link key={item.to} to={item.to} onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A5068] hover:bg-surface-2 hover:text-dark transition-colors">
                          <span>{item.icon}</span>{item.label}
                        </Link>
                      ))}
                      {user.is_staff && (
                        <Link to="/admin/dashboard" onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors">
                          <span>⚙️</span> Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-border-light">
                        <button onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger hover:bg-danger/5 transition-colors">
                          <span>🚪</span> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login"    className="btn-ghost text-sm h-9 px-4">Sign In</Link>
                  <Link to="/register" className="btn-primary text-sm h-9 px-4">Sign Up</Link>
                </div>
              )}

              {/* Hamburger */}
              <button onClick={() => setMobile(!mobileOpen)}
                className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 hover:bg-surface-2 rounded-lg transition-colors">
                <span className={`block w-5 h-0.5 bg-dark transition-all duration-200 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}/>
                <span className={`block w-5 h-0.5 bg-dark transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}/>
                <span className={`block w-5 h-0.5 bg-dark transition-all duration-200 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}/>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border-light bg-white animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="relative mb-4">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B91A8] pointer-events-none"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"/>
                </svg>
                <input value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products…"
                  className="w-full h-11 pl-9 pr-4 bg-surface-2 border border-border rounded-xl text-sm outline-none focus:border-primary transition-all"/>
              </form>

              {CATEGORIES.map((c) => (
                <Link key={c.slug} to={`/products?category=${c.slug}`}
                  onClick={() => setMobile(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#4A5068] hover:bg-surface-2 hover:text-dark transition-colors">
                  <span className="text-lg">{c.emoji}</span>{c.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-border-light space-y-2">
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setMobile(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#4A5068] hover:bg-surface-2">
                      👤 My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setMobile(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-[#4A5068] hover:bg-surface-2">
                      📦 My Orders
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/5">
                      🚪 Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/login"    onClick={() => setMobile(false)} className="btn-secondary w-full justify-center">Sign In</Link>
                    <Link to="/register" onClick={() => setMobile(false)} className="btn-primary w-full justify-center">Sign Up</Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
