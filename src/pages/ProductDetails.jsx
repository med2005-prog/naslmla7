import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingCart, Star, Check } from 'lucide-react';
import { getPromoTimeRemainingDetailed } from '../utils/timeUtils';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';

const getYoutubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, setProducts } = useProducts();
  const [timeRemaining, setTimeRemaining] = useState(null);

  const product = products.find(p => p._id === id);

  const [activeImage, setActiveImage] = useState(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  useEffect(() => {
    if (product) {
      setTimeout(() => setActiveImage(product.image), 0);
    }
  }, [product]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (product?.hasPromo && product?.promoEndDate && new Date(product.promoEndDate) > new Date()) {
      const updateTime = () => {
        const remaining = getPromoTimeRemainingDetailed(product.promoEndDate);
        setTimeRemaining(remaining);
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
    }
  }, [product]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isImageZoomed) {
        setIsImageZoomed(false);
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isImageZoomed]);
  if (!product) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>المنتج غير موجود</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>العودة للرئيسية</Link>
      </div>
    );
  }
  return (
    <>
      <div className="container" style={{ padding: '4rem 1.5rem' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', background: 'none', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 600 }}>
          <ArrowRight size={20} />
          <span>العودة للمنتجات</span>
        </button>
        <div className="product-layout fade-in">
          {/* Image Section */}
          <div className="gallery-container">
            {product.images && product.images.length > 1 && (
              <div className="thumbnails-side">
                {product.images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setActiveImage(img)}
                    onDoubleClick={() => {
                      setActiveImage(img);
                      setIsImageZoomed(true);
                    }}
                    className={`thumbnail-btn ${activeImage === img ? 'active' : ''}`}
                    title="انقر مرتين للتكبير"
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
            <div className="main-image-wrapper">
              <div className="card" style={{ padding: '0', overflow: 'hidden', background: '#f8fafc', height: '100%', cursor: 'zoom-in' }}>
                <img 
                  src={activeImage || product.image} 
                  alt={product.name} 
                  onClick={() => setIsImageZoomed(true)}
                  title="انقر للتكبير 🔍"
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    objectFit: 'contain', 
                    maxHeight: '500px',
                    cursor: 'zoom-in',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              </div>
            </div>
          </div>
          {/* Details Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ background: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.875rem', fontWeight: 700 }}>متوفر في المخزون</span>
                {product.hasPromo && product.promoEndDate && new Date(product.promoEndDate) > new Date() && (
                  <span style={{ 
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
                    color: 'white', 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.875rem', 
                    fontWeight: 700 
                  }}>
                    🔥 عرض خاص -{Math.round(((product.price - product.promoPrice) / product.price) * 100)}%
                  </span>
                )}
                <div style={{ display: 'flex', color: '#f59e0b' }}>
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                  <Star size={16} fill="#f59e0b" />
                </div>
              </div>
              <h1 className="product-title">{product.name}</h1>
            </div>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {product.fullDescription}
            </p>
            <div style={{ padding: '2rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              {/* Price Display with Promo */}
              {product.hasPromo && product.promoPrice && product.promoEndDate && new Date(product.promoEndDate) > new Date() ? (
                <div style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>السعر:</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ef4444', lineHeight: 1.2 }}>
                          <span className="numerals">{product.promoPrice}</span> <span style={{ fontSize: '1.25rem' }}>MAD</span>
                        </span>
                        <span style={{ 
                          fontSize: '1.25rem', 
                          color: 'var(--text-secondary)', 
                          fontWeight: 500
                        }}>
                          <span className="numerals" style={{ textDecoration: 'line-through' }}>{product.price}</span> MAD
                        </span>
                      </div>
                      {timeRemaining && !timeRemaining.expired && (
                        <p style={{
                          fontSize: '0.875rem',
                          color: timeRemaining.urgent ? '#dc2626' : '#92400e',
                          background: timeRemaining.urgent ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)' : '#fef3c7',
                          padding: '0.5rem 1rem',
                          borderRadius: '0.5rem',
                          display: 'inline-block',
                          fontWeight: timeRemaining.urgent ? 700 : 600,
                          border: timeRemaining.urgent ? '2px solid #dc2626' : 'none',
                          animation: timeRemaining.urgent ? 'pulse 2s infinite' : 'none'
                        }}>
                          {timeRemaining.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    borderRadius: '0.5rem',
                    textAlign: 'center',
                    marginBottom: '1rem'
                  }}>
                    <p style={{ fontWeight: 700, color: '#92400e', fontSize: '1.1rem' }}>
                      💰 وفر <span className="numerals">{product.price - product.promoPrice}</span> درهم الآن!
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>السعر:</span>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>
                    <span className="numerals">{product.price}</span> <span style={{ fontSize: '1.25rem' }}>MAD</span>
                  </span>
                </div>
              )}
              <button 
                onClick={() => addToCart(product)}
                className="btn btn-primary" 
                style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginBottom: '1.5rem' }}
              >
                <ShoppingCart size={24} />
                أضف إلى السلة
              </button>

              {/* Trust Badges */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr 1fr', 
                gap: '0.75rem',
                borderTop: '1px solid var(--border)',
                paddingTop: '1.5rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  background: 'var(--background)',
                  borderRadius: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ color: 'var(--primary)', background: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M6 15h.01"/><path d="M10 15h.01"/></svg>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>الدفع عند التوصيل</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  background: 'var(--background)',
                  borderRadius: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#059669', background: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h11c1.1 0 2 .9 2 2v1h5c1.1 0 2 .9 2 2v5l-3 3H15v3c0 1.1-.9 2-2 2h-2"/><circle cx="7" cy="18" r="2"/><circle cx="13" cy="18" r="2"/></svg>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>توصيل سريع</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  padding: '0.75rem 0.5rem',
                  background: 'var(--background)',
                  borderRadius: '0.75rem',
                  textAlign: 'center'
                }}>
                  <div style={{ color: '#f59e0b', background: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: '0.75rem' }}>ضمان لمدة شهر</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* YouTube Video Section */}
      {product.videoUrl && getYoutubeId(product.videoUrl) && (
        <div className="container" style={{ padding: '0 1.5rem 4rem' }}>
          <div className="card" style={{ padding: '1.5rem', background: 'var(--surface)' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 800, 
              marginBottom: '1.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              color: '#cc0000'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              فيديو توضيحي للمنتج
            </h3>
            <div style={{ 
              position: 'relative', 
              paddingBottom: '56.25%', 
              height: 0, 
              overflow: 'hidden', 
              borderRadius: '1rem',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
                src={`https://www.youtube.com/embed/${getYoutubeId(product.videoUrl)}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}


      {/* Related Products */}
      <div className="container" style={{ padding: '0 1.5rem 4rem' }}>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>منتجات قد تعجبك</h3>
        <div className="grid-products">
          {products
            .filter(p => p.category === product.category && p._id !== product.id)
            .slice(0, 3)
            .map(relatedProduct => (
               <div key={relatedProduct.id} className="card fade-in">
                <Link to={`/product/${relatedProduct.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ height: '250px', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={relatedProduct.image} 
                      alt={relatedProduct.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                      onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>{relatedProduct.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {relatedProduct.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>
                        <span className="numerals">{relatedProduct.price}</span> MAD
                      </span>
                      <span className="btn-icon">
                        <ShoppingCart size={18} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
      <style>{`
        .product-title {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1.2;
        }
        .product-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        
        .gallery-container {
          display: flex;
          flex-direction: column-reverse;
          gap: 1rem;
        }

        .thumbnails-side {
          display: flex;
          gap: 0.75rem;
          overflow-x: auto;
          padding: 0.5rem 0;
          scrollbar-width: thin;
        }

        .thumbnail-btn {
          flex: 0 0 80px;
          height: 80px;
          padding: 0;
          border-radius: 0.75rem;
          overflow: hidden;
          background: white;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.2s ease;
        }

        .thumbnail-btn.active {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
        }

        .thumbnail-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-image-wrapper {
          flex: 1;
          min-width: 0;
        }

        @media (min-width: 900px) {
          .product-layout {
            grid-template-columns: 1.2fr 1fr;
            align-items: start;
          }
          
          .gallery-container {
            flex-direction: row;
            height: 500px;
          }

          .thumbnails-side {
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
            flex: 0 0 100px;
            padding: 0;
          }

          .thumbnail-btn {
            flex: 0 0 100px;
            width: 100%;
          }
        }
        @media (max-width: 768px) {
          .product-title {
            font-size: 1.75rem;
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        .zoom-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          cursor: zoom-out;
          animation: fadeIn 0.2s ease;
          padding: 2rem;
        }
        .zoom-modal img {
          max-width: 95%;
          max-height: 95%;
          object-fit: contain;
          cursor: zoom-out;
          animation: zoomIn 0.3s ease;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Image Zoom Modal */}
      {isImageZoomed && (
        <div 
          className="zoom-modal" 
          onClick={() => setIsImageZoomed(false)}
        >
          <button
            onClick={() => setIsImageZoomed(false)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.2s ease',
              zIndex: 10000
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'white';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            ✕
          </button>
          
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '0.75rem 1.5rem',
            borderRadius: '2rem',
            color: '#333',
            fontSize: '0.9rem',
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}>
            انقر في أي مكان للإغلاق
          </div>
          
          <img 
            src={activeImage || product.image} 
            alt={product.name}
            onClick={() => setIsImageZoomed(false)}
          />
        </div>
      )}
    </>
  );
};
export default ProductDetails;
