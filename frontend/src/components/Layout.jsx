import { Link, NavLink, Outlet } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function Layout() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container nav">
          <Link to="/" className="brand" aria-label="Petalyn home">
            <span>Petalyn</span>
          </Link>
          <nav
            className={open ? 'mobile-open' : ''}
            aria-label="Primary navigation"
          >
            {[
              ['/', 'Home'],
              ['/products', 'Shop'],
              ['/about', 'About'],
              ['/contact', 'Contact'],
            ].map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setOpen(false)}
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="nav-actions">
            <Link
              to="/cart"
              className="cart-button"
              aria-label={`Shopping bag${count ? `, ${count} items` : ''}`}
            >
              <FiShoppingBag />
              {count > 0 && <b>{count}</b>}
            </Link>
            <button
              className="menu"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X /> : <FiMenu />}
            </button>
          </div>
        </div>
      </header>

      <Outlet />

      <footer>
        <div className="container footer-grid">
          <div>
            <Link to="/" className="brand">
              <span>Petalyn</span>
            </Link>
            <p>Thoughtful flowers for everyday moments, delivered with care.</p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/products">Shop flowers</Link>
            <Link to="/about">Our story</Link>
            <Link to="/contact">Contact us</Link>
          </div>
          <div>
            <h4>Visit</h4>
            <p>
              Sherwani Nagar, Lucknow
              <br />
              Uttar Pradesh, India
            </p>
            <p>hello@petalyn.in</p>
          </div>
          <div>
            <h4>Follow</h4>
            <div className="socials">
              <span aria-label="Instagram">
                <FaInstagram />
              </span>
              <span aria-label="Facebook">
                <FaFacebookF />
              </span>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          © {new Date().getFullYear()} Petalyn · Developed by Saleh for people who like
          flowers.
        </div>
      </footer>
    </div>
  );
}
