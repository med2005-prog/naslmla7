import React from 'react';
import ProductCard from '../components/ProductCard';
import { ShoppingBag } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
const Home = () => {
  const { products, loading } = useProducts();
  return (
    <>
      {/* Hero Section */}
      <header className="hero-header" style={{ 
        background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9)), url('/nas_logo.jpg')`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
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
          <h1 className="hero-title" style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            منتجات متنوعة تناسب احتياجاتك اليومية بأفضل جودة
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <a href="#products" className="btn btn-primary hero-btn">
              <ShoppingBag size={18} />
              تسوق الآن
            </a>
          </div>
        </div>
        
        {/* Decorative Floating Logo elements instead of generic circles */}
        <div style={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          width: '150px',
          height: '150px',
          backgroundImage: "url('/nas_logo.jpg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: '0.1',
          filter: 'blur(10px)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '100px',
          height: '100px',
          backgroundImage: "url('/nas_logo.jpg')",
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          opacity: '0.08',
          filter: 'blur(8px)',
          borderRadius: '50%'
        }}></div>
      </header>
      {/* Products Section */}
      <section id="products" className="products-section" style={{ padding: '5rem 0' }}>
        <div className="container">
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
            ) : products.length > 0 ? (
              products.map(product => (
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
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          text-align: center;
          background-size: 400px auto !important;
          padding: 4rem 2rem;
        }
        .hero-badge {
          padding: 0.3rem 0.8rem;
          font-size: 0.8rem;
          margin-bottom: 0.8rem;
        }
        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
          background: linear-gradient(to right, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }
        .hero-btn {
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
          box-shadow: 0 4px 15px rgba(25, 83, 157, 0.3);
        }
        @media (max-width: 768px) {
          .hero-header {
            min-height: 35vh;
          }
          .hero-title {
            font-size: 2rem;
          }
          .products-section {
            padding: 3rem 0 !important;
          }
        }
        @media (max-width: 480px) {
          .hero-header {
            min-height: 30vh;
            background-size: 250px auto !important;
            padding: 2rem 1rem;
          }
          .hero-badge {
             font-size: 0.7rem;
             padding: 0.2rem 0.6rem;
             margin-bottom: 0.5rem;
          }
          .hero-title {
            font-size: 1.5rem;
          }
          .hero-btn {
            font-size: 0.8rem;
            padding: 0.5rem 1rem;
          }
          .products-section {
            padding: 2rem 0 !important;
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
      `}</style>
    </>
  );
};
export default Home;
