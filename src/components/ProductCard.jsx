import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getPromoTimeRemaining } from '../utils/timeUtils';
import { useCart } from '../context/CartContext';
const ProductCard = ({ product }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const hasMultipleImages = images.length > 1;

  const isPromoActive = product.hasPromo && 
                        product.promoPrice && 
                        product.promoEndDate && 
                        new Date(product.promoEndDate) > new Date();

  useEffect(() => {
    let interval;
    if (isHovered && hasMultipleImages) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1000); // Change image every second
    }
    return () => clearInterval(interval);
  }, [isHovered, hasMultipleImages, images.length]);

  useEffect(() => {
    if (isPromoActive) {
      const updateTime = () => {
        const remaining = getPromoTimeRemaining(product.promoEndDate);
        setTimeRemaining(remaining);
      };
      updateTime(); // Initial update
      const interval = setInterval(updateTime, 1000); // Update every second
      return () => clearInterval(interval);
    }
  }, [isPromoActive, product.promoEndDate]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, quantity);
    setQuantity(1); // Reset quantity after adding
  };

  return (
    <div 
      className="card product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', position: 'relative' }}>
        <div className="image-container" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
          <img 
            src={images[currentImageIndex]} 
            alt={product.name} 
            loading="lazy"
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              transition: isHovered ? 'none' : 'transform 0.5s ease' 
            }}
          />
          {isPromoActive && (
            <div className="product-card-badge-promo" style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '0.35rem 0.75rem',
              borderRadius: '2rem',
              fontWeight: 700,
              fontSize: '0.7rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              zIndex: 10
            }}>
              🔥 -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
            </div>
          )}
          <div className="product-card-badge-cod" style={{
            position: 'absolute',
            bottom: '0.5rem',
            left: '0.5rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            color: '#166534',
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            fontSize: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M6 15h.01"/><path d="M10 15h.01"/></svg>
            <span className="cod-text">COD</span>
          </div>
        </div>
      </Link>
      <div className="product-card-body" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <h3 className="product-card-title" style={{ fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h3>
        
        {/* Price Display */}
        {isPromoActive ? (
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="product-card-price" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ef4444' }}>
                <span className="numerals">{product.promoPrice}</span> <span style={{ fontSize: '0.7rem' }}>MAD</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                <span className="numerals">{product.price}</span>
              </span>
            </div>
          </div>
        ) : (
          <div style={{ marginBottom: '0.5rem' }}>
            <span className="product-card-price" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>
              <span className="numerals">{product.price}</span> <span style={{ fontSize: '0.75rem' }}>MAD</span>
            </span>
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          {/* Quantity Selection Row */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '0.5rem',
            background: '#f8fafc',
            borderRadius: '0.5rem',
            padding: '0.2rem'
          }}>
            <button 
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'white', borderRadius: '0.35rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              -
            </button>
            <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              style={{ padding: '0.25rem 0.5rem', border: 'none', background: 'white', borderRadius: '0.35rem', cursor: 'pointer', fontWeight: 'bold' }}
            >
              +
            </button>
          </div>

          <button 
            onClick={handleAddToCart}
            className="btn btn-primary" 
            style={{ width: '100%', fontSize: '0.75rem', padding: '0.5rem', justifyContent: 'center', gap: '0.25rem' }}
          >
            <Plus size={14} />
            أضف للسلة
          </button>
        </div>
      </div>
      <style>{`
        .product-card:hover img {
          transform: scale(1.1);
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};
export default ProductCard;
