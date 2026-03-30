import React from 'react';
import ProductCard from '../components/ProductCard';
import { ShoppingBag } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
const Home = () => {
  const { products, loading, categories: contextCategories } = useProducts();
  const [activeCategory, setActiveCategory] = React.useState("الكل");
  const categories = ["الكل", ...(contextCategories || [])];

  const filteredProducts = activeCategory === "الكل" 
    ? products 
    : products.filter(p => (p.category || 'عام') === activeCategory);

  return (
    <>
      {/* Hero Section */}
      <header className="hero-header">
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-logo-container">
            <img 
              src="/nas_logo.jpg" 
              alt="NasLmla7 Brand Logo" 
              className="hero-logo-img"
              loading="eager"
              fetchpriority="high"
            />
          </div>
          <span className="hero-badge" style={{ 
            display: 'inline-block', 
            background: 'rgba(25, 83, 157, 0.1)', 
            color: 'var(--primary)', 
            borderRadius: '2rem', 
            fontWeight: 700,
            border: '1px solid rgba(25, 83, 157, 0.2)'
          }}>
            كل ما تبحث عنه في مكان واحد
          </span>
          <h1 className="hero-title">
            أفضل المنتجات لـ <span className="text-highlight">احتياجاتك</span> اليومية
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="#products" className="btn btn-primary hero-btn">
              <ShoppingBag size={18} />
              تسوق الآن
            </a>
          </div>
        </div>
      </header>
      {/* Products Section */}
      <section id="products" className="products-section" style={{ padding: '5rem 0' }}>
        <div className="container">
          
          {/* Categories Filter */}
          <div className="categories-scroll" style={{
            display: 'flex',
            gap: '0.75rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            marginBottom: '2rem',
            scrollbarWidth: 'none',
          }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '0.5rem 1.5rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: activeCategory === cat ? 'var(--primary)' : 'rgba(25, 83, 157, 0.1)',
                  color: activeCategory === cat ? 'white' : 'var(--primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid-products fade-in">
            {loading ? (
              [...Array(6)].map((_, idx) => (
                <div key={idx} style={{ 
                  height: '400px', 
                  background: '#f8fafc', 
                  borderRadius: '1.5rem', 
                  animation: 'pulse 1.5s infinite alternate',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0'
                }}></div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                <p>لا توجد منتجات حالياً</p>
                <div style={{ marginTop: '1rem' }}>
                  <img src="/nas_logo.png" alt="لوجو NasLmla7 - متجر إلكتروني مغربي للتسوق أونلاين" style={{ opacity: 0.1, width: '100px' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <style>{`
        .hero-header {
          min-height: auto;
          padding: 5rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          text-align: center;
          background-color: #f8fafc;
          border-bottom: 1px solid #f1f5f9;
        }
        .hero-logo-container {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .hero-logo-img {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          object-fit: cover;
        }
        .hero-badge {
          padding: 0.3rem 0.8rem;
          font-size: 0.8rem;
          margin-bottom: 1rem;
          color: #64748b;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          color: #0f172a;
          line-height: 1.1;
        }
        .text-highlight {
          color: var(--secondary);
        }
        .hero-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          box-shadow: 0 4px 15px rgba(25, 83, 157, 0.3);
        }
        @media (max-width: 768px) {
          .hero-header {
            padding: 2.5rem 1.5rem;
          }
          .hero-title {
            font-size: 2rem;
          }
          .products-section {
            padding: 2rem 0 !important;
          }
        }
        @media (max-width: 480px) {
          .hero-header {
            min-height: auto;
            padding: 1.25rem 1rem;
          }
          .hero-logo-img {
            width: 55px;
            height: 55px;
            margin-bottom: 0.5rem;
          }
          .hero-badge {
             font-size: 0.7rem;
             margin-bottom: 0.5rem;
             padding: 0.2rem 0.6rem;
          }
          .hero-title {
            font-size: 1.25rem;
            text-shadow: none;
            margin-bottom: 0.75rem;
          }
          .hero-btn {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
          }
          .products-section {
            padding: 1rem 0 !important;
          }
        }
        @keyframes pulse {
          from {
            opacity: 0.6;
            background-color: #f1f5f9;
          }
          to {
            opacity: 1;
            background-color: #e2e8f0;
          }
        }
        .categories-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};
export default Home;
