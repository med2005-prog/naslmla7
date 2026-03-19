import React from 'react';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductList = ({ products, handleEdit, handleDelete, setShowForm }) => {
  const navigate = useNavigate();

  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {products.map(product => {
          const displayId = product._id || product.id;
          return (
            <div
              key={displayId}
              style={{
                background: 'white',
                borderRadius: '1rem',
                overflow: 'hidden',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                transition: 'transform 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ position: 'relative', height: '200px' }}>
                <img
                  src={product.image || (product.images && product.images[0])}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                
                {/* View Product Button Overlay */}
                <button
                  onClick={() => navigate(`/product/${displayId}`)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  title="عرض صفحة المنتج"
                >
                  <Eye size={18} color="var(--primary)" />
                </button>
                
                {/* Promo Badge Overlay */}
                {product.hasPromo && product.promoEndDate && new Date(product.promoEndDate) > new Date() && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                    color: '#fff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '2rem',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
                  }}>
                    🎉 عرض خاص
                  </div>
                )}
              </div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {product.name}
                </h3>

                <p style={{
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem',
                  lineHeight: 1.6,
                  flex: 1
                }}>
                  {product.description}
                </p>
                
                {/* Price Display with Promo */}
                {product.hasPromo && product.promoPrice && product.promoEndDate && new Date(product.promoEndDate) > new Date() ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.5rem' }}>
                      <p style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: '#ef4444',
                        margin: 0,
                        lineHeight: 1.2
                      }}>
                        <span className="numerals">{product.promoPrice}</span> MAD
                      </p>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        fontWeight: 500
                      }}>
                        <span className="numerals" style={{ textDecoration: 'line-through' }}>{product.price}</span> MAD
                      </p>
                    </div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#92400e',
                      background: '#fef3c7',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      display: 'inline-block',
                      margin: 0
                    }}>
                      ⏰ ينتهي: {new Date(product.promoEndDate).toLocaleString('ar-MA')}
                    </p>
                  </div>
                ) : (
                  <p style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    marginBottom: '1rem'
                  }}>
                    <span className="numerals">{product.price}</span> MAD
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleEdit(product)}
                    className="btn"
                    style={{
                      flex: 1,
                      background: 'var(--primary)',
                      color: 'white',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Edit2 size={16} /> تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(displayId)}
                    className="btn"
                    style={{
                      flex: 1,
                      background: '#ef4444',
                      color: 'white',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <Trash2 size={16} /> حذف
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {products.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          color: 'var(--text-secondary)'
        }}>
          <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
            لا توجد منتجات حالياً
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={20} />
            إضافة أول منتج
          </button>
        </div>
      )}
    </>
  );
};

export default ProductList;
