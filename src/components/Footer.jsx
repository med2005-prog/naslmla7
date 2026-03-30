import React from 'react';
import { Home, Package, Info, Link as LinkIcon, MessageSquare } from 'lucide-react';
const Footer = () => {
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="footer-grid">

          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid var(--primary)', width: 'fit-content', paddingBottom: '0.25rem' }}>
              <LinkIcon size={20} color="var(--primary)" />
              روابط سريعة
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#94a3b8' }}>
              <li>
                <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-link">
                  <Home size={16} /> الرئيسية
                </a>
              </li>
              <li>
                <a href="/#products" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-link">
                  <Package size={16} /> المنتجات
                </a>
              </li>
              <li>
                <a href="/about" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hover-link">
                  <Info size={16} /> من نحن
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid var(--primary)', width: 'fit-content', paddingBottom: '0.25rem' }}>
              <MessageSquare size={20} color="var(--primary)" />
              تواصل معنا
            </h4>
            <a 
              href="https://www.instagram.com/nas.lmla7?igsh=OWhzemhyaWZmczE=" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.5rem' }}
              className="hover-text"
            >
              <img src="/icons/social_1.jpg" alt="Instagram" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} /> Instagram
            </a>
            <a 
              href="https://youtube.com/@naslmla7?si=pSVaUPYj3L3Jx_l8" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.5rem' }}
              className="hover-text"
            >
              <img src="/icons/social_4.png" alt="YouTube" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} /> YouTube
            </a>
            <a 
              href="https://www.facebook.com/share/1ERmQ7cdY1/" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.5rem' }}
              className="hover-text"
            >
              <img src="/icons/social_2.jpg" alt="Facebook" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} /> Facebook
            </a>
            <a 
              href="https://tiktok.com/@nas.lmla7" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '0.5rem' }}
              className="hover-text"
            >
              <img src="/icons/social_3.jpg" alt="TikTok" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} /> TikTok
            </a>
            <a 
              href="https://wa.me/212709277659" 
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94a3b8', direction: 'ltr', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              className="hover-text"
            >
              <img src="/icons/social_0.jpg" alt="WhatsApp" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} /> +212 709277659
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #334155', marginTop: '3rem', paddingTop: '1.5rem', textAlign: 'center', color: '#64748b' }}>
          &copy; <span className="numerals">2026</span> Nas lmla7. جميع الحقوق محفوظة.
        </div>
        <style>{`
          .site-footer {
          background: #1e293b;
          color: white;
          padding: 4rem 0;
          margin-top: auto;
        }
        .footer-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 3rem;
          justify-content: space-between;
        }
        .hover-text {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          padding: 0.5rem;
          border-radius: 0.5rem;
        }
        .hover-text:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-10px) scale(1.1);
        }
        .hover-text img {
          transition: transform 0.4s ease;
        }
        .hover-text:hover img {
          transform: rotate(360deg) scale(1.2);
          box-shadow: 0 0 15px var(--primary);
        }
        .hover-link {
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: inline-flex;
          align-items: center;
          padding: 0.3rem 0;
          cursor: pointer;
        }
        .hover-link:hover {
          color: var(--secondary) !important;
          transform: translateX(-10px);
          text-shadow: 0 0 8px rgba(25, 83, 157, 0.4);
        }
        .hover-link svg {
          transition: transform 0.3s ease;
        }
        .hover-link:hover svg {
          transform: scale(1.3) rotate(-10deg);
          color: var(--primary);
        }
        @media (max-width: 768px) {
          .site-footer {
            padding: 1.5rem 0;
            min-height: auto;
          }
          .footer-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .footer-grid > div:first-child {
            grid-column: 1 / -1;
            margin-bottom: 0.5rem;
          }
          .site-footer h3 {
             font-size: 1.15rem !important;
             margin-bottom: 0.5rem !important;
          }
          .site-footer h4 {
             font-size: 1rem !important;
             margin-bottom: 0.5rem !important;
          }
          .site-footer p, .site-footer ul, .site-footer a {
             font-size: 0.85rem !important;
          }
        }
        @media (max-width: 480px) {
           .footer-grid {
             display: flex;
             flex-direction: column;
             gap: 1rem;
           }
           .footer-grid > div:first-child {
             display: none;
           }
           .site-footer {
             padding: 1rem 0 0.5rem 0;
           }
           .footer-grid > div:nth-child(2) {
             display: flex;
             flex-wrap: wrap;
             gap: 0.5rem;
           }
           .footer-grid > div:nth-child(2) h4 {
             flex: 1 1 100%;
             margin-bottom: 0.5rem !important;
           }
           .hover-text {
             padding: 0 !important;
             margin-bottom: 0 !important;
             margin-right: 0.5rem;
             font-size: 0 !important; /* Hide text, keep only icon */
           }
           .hover-text img {
             width: 25px !important;
             height: 25px !important;
           }
           div[style*='margin-top: 3rem'] {
             margin-top: 1rem !important;
             padding-top: 0.75rem !important;
             font-size: 0.75rem;
           }
        }
        `}</style>
      </div>
    </footer>
  );
};
export default Footer;
