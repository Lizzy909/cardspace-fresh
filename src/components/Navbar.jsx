
import { useState } from "react";
import {
  Layers,
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

const links = [
  { label: "HOME", href: "#home" },
  { label: "SERVICES", href: "#how-it-works" },
  { label: "CONTACT US", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      {/* Logo */}
      <a
        href="#home"
        className="brand"
        onClick={closeMenu}
        aria-label="Cardspace home"
      >
        <span className="brand-icon">
          <Layers size={25} strokeWidth={2.5} />
        </span>

        <span className="brand-name">
          card<span>space</span>
          <Sparkles className="brand-sparkle" size={14} />
        </span>
      </a>

      {/* Mobile menu button */}
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        {menuOpen ? <X size={23} /> : <Menu size={23} />}
      </button>

      {/* Navigation links */}
      <nav
        className={menuOpen ? "nav-links open" : "nav-links"}
        aria-label="Main navigation"
      >
        {links.map((link, index) => (
          <a
            key={link.href}
            href={link.href}
            className={
              index === 0 ? "nav-link active" : "nav-link"
            }
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}

        {/* Verify Now button */}
        <a
          href="#verify"
          className="nav-contact"
          onClick={closeMenu}
        >
          <span>VERIFY NOW</span>
          <ArrowUpRight size={18} />
        </a>
      </nav>
    </header>
  );
}
