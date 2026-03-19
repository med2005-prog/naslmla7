import React from 'react';
import ProductCard from '../components/ProductCard';
import { ShoppingBag } from 'lucide-react';
import { useProducts } from '../context/ProductsContext';
const Home = () => {
  const { products, loading } = useProducts();
  return (
    <>
      {/* Hero Section */}
      <header style={{ 
        background: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.95)), url('/nas_logo.jpg')`,
        backgroundSize: '300px auto',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', 
        overflow: 'hidden',
        textAlign: 'center',
        borderBottom: '1px solid var(--border)'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <span style={{ 
            display: 'inline-block', 
            padding: '0.3rem 0.8rem', 
            background: 'rgba(25, 83, 157, 0.1)', 
            color: 'var(--primary)', 
            borderRadius: '2rem', 
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '0.8rem',
            border: '1px solid rgba(25, 83, 157, 0.2)'
          }}>
            كل ما تبحث عنه في مكان واحد
          </span>
          <h1 className="hero-title" style={{ background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            منتجات متنوعة تناسب احتياجاتك اليومية بأفضل جودة
          </h1>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem' }}>
            <a href="#products" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', boxShadow: '0 4px 15px rgba(25, 83, 157, 0.3)' }}>
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
      <section id="products" style={{ padding: '5rem 0' }}>
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
                  <img src="/nas_logo.png" alt="شعار" style={{ opacity: 0.1, width: '100px' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      <style>{`
        .hero-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 0.8rem;
          background: linear-gradient(to right, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1.2;
        }
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
        }
        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.6rem;
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
