import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { getPromoTimeRemaining } from '../utils/timeUtils';
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
  return (
    <div 
      className="card product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setCurrentImageIndex(0); }}
    >
      <Link to={`/product/${product._id}`} style={{ display: 'block', overflow: 'hidden', position: 'relative' }}>
        <div className="image-container" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
          <img 
            src={images[currentImageIndex]} 
            alt={product.name} 
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
              top: '1rem',
              right: '1rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              zIndex: 10
            }}>
              🔥 -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
            </div>
          )}
          <div className="product-card-badge-cod" style={{
            position: 'absolute',
            bottom: '0.75rem',
            left: '0.75rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            color: '#166534',
            padding: '0.35rem 0.75rem',
            borderRadius: '0.5rem',
            fontWeight: 700,
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M6 15h.01"/><path d="M10 15h.01"/></svg>
            <span className="cod-text">الدفع عند التوصيل</span>
          </div>
        </div>
      </Link>
      <div className="product-card-body" style={{ padding: '1.5rem' }}>
        <h3 className="product-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>{product.name}</h3>
        <p className="product-card-description" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: '1.5', height: '3em', overflow: 'hidden' }}>
          {product.description}
        </p>
        {/* Price Display */}
        {isPromoActive ? (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
              <span className="product-card-price" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>
                <span className="numerals">{product.promoPrice}</span> <span style={{ fontSize: '0.9rem' }}>MAD</span>
              </span>
              <span style={{ 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)', 
                fontWeight: 500
              }}>
                <span className="numerals" style={{ textDecoration: 'line-through' }}>{product.price}</span> MAD
              </span>
            </div>
            {timeRemaining && !timeRemaining.expired && (
              <p style={{
                fontSize: '0.75rem',
                color: timeRemaining.urgent ? '#dc2626' : '#92400e',
                background: timeRemaining.urgent ? '#fee2e2' : '#fef3c7',
                padding: '0.25rem 0.5rem',
                borderRadius: '0.25rem',
                display: 'inline-block',
                fontWeight: timeRemaining.urgent ? 700 : 600,
                animation: timeRemaining.urgent ? 'pulse 2s infinite' : 'none',
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {timeRemaining.text}
              </p>
            )}
          </div>
        ) : (
          <div style={{ marginBottom: '1rem' }}>
            <span className="product-card-price" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              <span className="numerals">{product.price}</span> <span style={{ fontSize: '0.9rem' }}>MAD</span>
            </span>
          </div>
        )}
        <Link to={`/product/${product._id}`} className="btn btn-primary product-card-btn" style={{ width: '100%', justifyContent: 'center' }}>
          <Plus size={18} className="btn-icon" />
          عرض التفاصيل
        </Link>
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
