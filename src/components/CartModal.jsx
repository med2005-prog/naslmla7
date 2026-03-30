import React, { useState } from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from './CheckoutModal';
const CartModal = ({ isOpen, onClose }) => {
  const { items, removeFromCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  if (!isOpen) return null;
  const total = items.reduce((sum, item) => {
    const hasPromo = item.hasPromo && item.promoPrice && item.promoEndDate && new Date(item.promoEndDate) > new Date();
    const price = hasPromo ? item.promoPrice : item.price;
    const numericPrice = parseFloat(price) || 0;
    return sum + (numericPrice * (item.quantity || 1));
  }, 0);
  return (
    <>
      <div className="cart-modal-overlay" onClick={onClose}>
        <div className="cart-modal-content glass slide-in-right" onClick={e => e.stopPropagation()}>
          <div className="cart-header">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 800 }}>
              <ShoppingBag />
              سلة المشتريات
            </h2>
            <button onClick={onClose} className="close-btn">
              <X size={24} />
            </button>
          </div>
          <div className="cart-items">
            {items.length === 0 ? (
              <div className="cart-empty-state">
                <p style={{ fontSize: '1.1rem' }}>سلتك فارغة حالياً</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="cart-item">
                  <img src={item.image || (item.images && item.images[0])} alt={item.name} className="cart-item-img" />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.name}
                      {item.quantity > 1 && (
                        <span style={{ fontSize: '0.8rem', background: 'var(--primary)', color: 'white', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>
                           x{item.quantity}
                        </span>
                      )}
                    </h4>
                    {item.hasPromo && item.promoPrice && item.promoEndDate && new Date(item.promoEndDate) > new Date() ? (
                        <div className="price">
                            <span className="numerals" style={{color: '#ef4444'}}>{item.promoPrice}</span> <span style={{fontSize: '0.8em'}}>MAD</span>
                            <br/>
                            <span className="numerals" style={{textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.875em'}}>{item.price}</span>
                        </div>
                    ) : (
                        <p className="price"><span className="numerals">{item.price}</span> MAD</p>
                    )}
                  </div>
                  <button 
                    onClick={() => removeFromCart(item._id || item.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', padding: '0.5rem', cursor: 'pointer', transition: 'color 0.2s' }}
                    title="حذف من السلة"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="cart-footer">
            <div className="cart-total">
              <span>المجموع:</span>
              <span className="price"><span className="numerals">{total}</span> MAD</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem' }} 
                onClick={() => setIsCheckoutOpen(true)}
                disabled={items.length === 0}
              >
                إتمام الطلب
              </button>
              <button 
                className="btn" 
                style={{ width: '100%', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)' }} 
                onClick={onClose}
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        </div>
        <style>{`
          .cart-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            z-index: 2000;
            backdrop-filter: blur(4px);
            display: flex;
            justify-content: flex-end;
            transition: all 0.3s ease;
          }
          .cart-modal-content {
            width: 100%;
            max-width: 450px;
            height: 100%;
            background: var(--surface);
            padding: 2rem;
            display: flex;
            flex-direction: column;
            box-shadow: -10px 0 30px rgba(0,0,0,0.15);
            cursor: default;
            position: relative;
          }
          .cart-empty-state {
            text-align: center;
            padding: 4rem 0;
            color: var(--text-secondary);
          }
          @media (max-width: 480px) {
            .cart-modal-overlay {
              align-items: flex-end;
              justify-content: center;
              background: rgba(0, 0, 0, 0.7);
            }
            .cart-modal-content {
              max-width: 100%;
              height: auto;
              max-height: 85vh;
              padding: 1.5rem 1.25rem;
              border-radius: 2rem 2rem 0 0;
              box-shadow: 0 -10px 25px rgba(0,0,0,0.1);
              animation: slideInUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
            }
            .cart-empty-state {
              padding: 2rem 0;
            }
            .cart-header {
              margin-bottom: 1rem;
            }
          }
          .slide-in-right {
            animation: slideInRight 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          @keyframes slideInRight {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes slideInUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .cart-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border);
          }
          .cart-items {
            flex: 1;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          .cart-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--background);
            border-radius: 0.75rem;
            animation: fadeIn 0.3s ease;
          }
          .cart-item-img {
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 0.5rem;
          }
          .cart-footer {
            margin-top: 2rem;
            padding-top: 1.5rem;
            border-top: 1px solid var(--border);
          }
          .cart-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 1.25rem;
            font-weight: 700;
            margin-bottom: 1.5rem;
          }
        `}</style>
      </div>
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        product={null} // Null indicates cart checkout
      />
    </>
  );
};
export default CartModal;
