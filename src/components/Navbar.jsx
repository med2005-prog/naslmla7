import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Home as HomeIcon, Package, Phone, Menu, X, Info } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartModal from './CartModal';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const location = useLocation();
  const { cartCount, isAnimating } = useCart();
  const toggleMenu = () => setIsOpen(!isOpen);
  return (
    <>
      <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Logo - Flex: 1 to help centering the menu */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
              <img src="/nas_logo.jpg" alt="Nas lmla7" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
              <span className="nav-logo-text">Nas lmla7</span>
            </Link>
          </div>

          {/* Desktop Menu - Centered */}
          <div className="desktop-menu" style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
            {/* Products Link Desktop */}
            <a href="#products" className="hover-link-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} />
              المنتجات
            </a>

            <Link to="/" className={location.pathname === '/' ? 'active-link' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HomeIcon size={18} />
              الرئيسية
            </Link>

            <Link to="/about" className={location.pathname === '/about' ? 'active-link' : ''} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={18} />
              من نحن
            </Link>
            
            {/* Contact Dropdown Desktop */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setIsContactOpen(true)}
              onMouseLeave={() => setIsContactOpen(false)}
            >
              <button 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  background: 'none', 
                  color: 'inherit',
                  fontSize: 'inherit',
                  fontWeight: 'inherit',
                  cursor: 'pointer',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  transition: 'all 0.3s'
                }}
                className="hover-link-nav"
              >
                <Phone size={18} />
                تواصل معنا
              </button>
              
              {isContactOpen && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  width: '200px',
                  borderRadius: '1rem',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid var(--border)',
                  animation: 'fadeIn 0.2s ease-out'
                }}>
                  <a href="https://wa.me/212709277659" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <img src="/icons/social_0.jpg" alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} /> واتساب
                  </a>
                  <a href="https://www.instagram.com/nas.lmla7?igsh=OWhzemhyaWZmczE=" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <img src="/icons/social_1.jpg" alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} /> انستغرام
                  </a>
                  <a href="https://youtube.com/@naslmla7?si=pSVaUPYj3L3Jx_l8" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <img src="/icons/social_4.png" alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} /> يوتيوب
                  </a>
                  <a href="https://www.facebook.com/share/1ERmQ7cdY1/" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <img src="/icons/social_2.jpg" alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} /> فيسبوك
                  </a>
                  <a href="https://tiktok.com/@nas.lmla7" target="_blank" rel="noopener noreferrer" className="dropdown-item">
                    <img src="/icons/social_3.jpg" alt="" style={{ width: '20px', height: '20px', borderRadius: '50%' }} /> تيك توك
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Cart & Menu - Flex: 1 to balance centering */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem' }}>
            <button 
              onClick={() => setIsCartOpen(true)}
              className={`cart-pill-btn ${cartCount > 0 ? 'has-items' : ''} ${isAnimating ? 'bump' : ''}`}
            >
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShoppingCart size={20} />
                <span className="cart-text" style={{ fontWeight: '700', fontSize: '0.9rem' }}>السلة</span>
                {cartCount > 0 && (
                  <span className="cart-count-badge">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

            {/* Mobile Toggle Button */}
            <button 
              className="mobile-menu-btn" 
              onClick={toggleMenu}
              style={{
                display: 'none',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '0.6rem',
                borderRadius: '0.75rem',
                color: 'var(--primary)',
                cursor: 'pointer'
              }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
          </div>
        </div>
        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div className="mobile-menu glass" style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            borderTop: '1px solid var(--border)'
          }}>
            <Link to="/" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HomeIcon size={20} />
              الرئيسية
            </Link>
            <Link to="/about" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={20} />
              من نحن
            </Link>
            <a href="#products" onClick={toggleMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={20} />
              المنتجات
            </a>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                <Phone size={20} /> تواصل معنا:
               </div>
               <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <a href="https://wa.me/212709277659" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/social_0.jpg" alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  </a>
                   <a href="https://www.instagram.com/nas.lmla7?igsh=OWhzemhyaWZmczE=" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/social_1.jpg" alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  </a>
                  <a href="https://youtube.com/@naslmla7?si=pSVaUPYj3L3Jx_l8" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/social_4.png" alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  </a>
                  <a href="https://www.facebook.com/share/1ERmQ7cdY1/" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/social_2.jpg" alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  </a>
                  <a href="https://tiktok.com/@nas.lmla7" target="_blank" rel="noopener noreferrer">
                    <img src="/icons/social_3.jpg" alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                  </a>
               </div>
            </div>
          </div>
        )}
        <style>{`
          .desktop-menu a, .hover-link-nav {
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            text-decoration: none;
            color: inherit;
          }
          .desktop-menu a:hover, .hover-link-nav:hover {
            color: var(--primary);
            transform: translateY(-2px) scale(1.1);
            background: rgba(25, 83, 157, 0.05);
          }
          .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
            font-size: 0.95rem;
            font-weight: 600;
          }
          .dropdown-item:hover {
            background: var(--background);
            color: var(--primary) !important;
            transform: translateX(-5px);
          }
          .active-link {
            color: var(--primary) !important;
            font-weight: 800;
          }
          /* New Premium Cart Pill Style */
          .cart-pill-btn {
            background: var(--surface);
            color: var(--primary);
            border: 2px solid var(--primary);
            padding: 0.6rem 1.2rem;
            border-radius: 2rem;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
          }
          .cart-pill-btn.has-items {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            border-color: transparent;
            box-shadow: 0 8px 20px rgba(25, 83, 157, 0.3);
          }
          .cart-pill-btn:hover {
            transform: translateY(-3px) scale(1.05);
          }
          .cart-pill-btn:active {
            transform: scale(0.95);
          }
          .cart-count-badge {
            background: #ffffff;
            color: var(--primary);
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.75rem;
            font-weight: 800;
            margin-right: 0.2rem;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          }
          .bump {
            animation: jump-basket 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          @keyframes jump-basket {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          .mobile-menu a {
            width: 100%;
            text-align: center;
            padding: 1rem;
            transition: all 0.3s ease;
            border-radius: 0.75rem;
          }
          .mobile-menu a:hover {
            background: var(--background);
            color: var(--primary);
            transform: scale(1.05);
          }
          @media (max-width: 900px) {
            .desktop-menu {
              display: none !important;
            }
            .mobile-menu-btn {
              display: block !important;
            }
            .cart-text {
              display: none;
            }
            .nav-logo-text {
              display: none;
            }
          }
          @media (max-width: 480px) {
            .cart-pill-btn {
              padding: 0.5rem;
            }
          }
        `}</style>
      </nav>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
export default Navbar;
