import { Link } from "react-router-dom";

const LINKS = {
  Shop: [
    { label: "Laptops",     to: "/products?category=laptops" },
    { label: "Desktops",    to: "/products?category=desktops" },
    { label: "iPhones",     to: "/products?category=iphones" },
    { label: "Android",     to: "/products?category=android" },
    { label: "Printers",    to: "/products?category=printers" },
    { label: "Accessories", to: "/products?category=accessories" },
  ],
  Account: [
    { label: "My Profile",  to: "/profile" },
    { label: "My Orders",   to: "/orders" },
    { label: "Wishlist",    to: "/wishlist" },
  ],
  Support: [
    { label: "Help Center",   to: "/help" },
    { label: "Track Order",   to: "/orders" },
    { label: "Returns",       to: "/returns" },
    { label: "Warranty",      to: "/warranty" },
    { label: "Contact Us",    to: "/contact" },
  ],
};


export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Main grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 py-16 border-b border-white/8">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 w-fit group">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm font-display">
                T
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight">
                Tech<span className="text-primary-light">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-[240px] mb-6">
              Kenya's most trusted electronics retailer. Premium tech, competitive prices, fast delivery.
            </p>
            {/* Social links */}
            <div className="flex gap-2">
              {["𝕏", "f", "in", "▶"].map((icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 flex items-center justify-center bg-white/6 border border-white/10 rounded-lg
                             text-white/50 hover:text-white hover:bg-white/12 transition-all text-xs font-bold">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display font-semibold text-white text-xs uppercase tracking-widest mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to}
                      className="text-sm text-white/45 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <p className="text-xs text-white/28 order-2 sm:order-1">
            © {new Date().getFullYear()} TechMart Electronics Ltd. All rights reserved. Nairobi, Kenya.
          </p>
        </div>
      </div>
    </footer>
  );
}
