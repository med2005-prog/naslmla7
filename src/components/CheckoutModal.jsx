import React, { useState } from 'react';
import { X, CheckCircle, Send } from 'lucide-react';
import { sendOrderToGoogleSheets } from '../services/googleSheets';
import { createOrder } from '../services/api';
import { useCart } from '../context/CartContext';
const CheckoutModal = ({ product, isOpen, onClose }) => {
  const { addToCart, items, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [isOrdered, setIsOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    if (isOrdered) {
      clearCart();
    }
    onClose();
  };

  if (!isOpen) return null;
  const isCartCheckout = !product;
  const checkoutItems = isCartCheckout ? items : [product];
  const totalPrice = checkoutItems.reduce((sum, item) => {
    const hasPromo = item.hasPromo && item.promoPrice && item.promoEndDate && new Date(item.promoEndDate) > new Date();
    return sum + (hasPromo ? parseFloat(item.promoPrice) : parseFloat(item.price));
  }, 0);
  if (checkoutItems.length === 0) return null;
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'المرجو إدخال الاسم الكامل';
    }
    const phoneRegex = /^0\d{9}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!formData.phone) {
      newErrors.phone = 'المرجو إدخال رقم الهاتف';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone = 'رقم الهاتف يجب أن يتكون من 10 أرقام ويبدأ بـ 0';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'المرجو إدخال العنوان';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
        const aggregatedItems = checkoutItems.reduce((acc, item) => {
          const key = item._id || item.id || item.name;
          if (!acc[key]) {
            acc[key] = { name: item.name, count: 0 };
          }
          acc[key].count += 1;
          return acc;
        }, {});
        const productNames = Object.values(aggregatedItems).map(item => {
          return `${item.name} (x${item.count})`;
        }).join(' + ');
        const orderData = {
          productName: productNames, 
          productPrice: totalPrice,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address
        };
        const orderDataToBackend = {
           customerInfo: {
               fullName: formData.fullName,
               phone: formData.phone,
               address: formData.address
           },
           orderItems: checkoutItems.map(item => ({
               product: item._id || undefined, // Use backend _id if it exists
               name: item.name,
               // Check if it's from Cart with 'quantity' or Single Product checkout
               quantity: item.quantity || 1, 
               price: item.hasPromo && item.promoPrice && new Date(item.promoEndDate) > new Date() ? parseFloat(item.promoPrice) : parseFloat(item.price),
               image: item.image || item.images?.[0] || ''
           })),
           totalPrice
       };

      const result = await sendOrderToGoogleSheets(orderData);
      
      let dbOrderCreated = false;
      try {
          await createOrder(orderDataToBackend);
          dbOrderCreated = true;
      } catch (dbError) {
          console.error("Failed to save to backend DB", dbError);
      }

      if (result.success || dbOrderCreated) {
        try {
          const orders = JSON.parse(localStorage.getItem('orders') || '[]');
          const newLocalOrder = {
            id: Date.now(),
            items: checkoutItems.map(item => ({
              id: item.id || item._id,
              name: item.name,
              price: item.hasPromo && item.promoPrice && new Date(item.promoEndDate) > new Date() ? item.promoPrice : item.price,
              adminEmail: item.adminEmail || 'mohammedelmalki2005@gmail.com'
            })),
            totalPrice,
            customerName: formData.fullName,
            date: new Date().toISOString()
          };
          orders.push(newLocalOrder);
          localStorage.setItem('orders', JSON.stringify(orders));
        } catch (storageErr) {
          console.error('Error saving order locally:', storageErr);
        }
        console.log('Order submitted:', { productNames, ...formData });
        setIsOrdered(true);
      } else {
        alert('عذراً، حدث خطأ أثناء إرسال الطلب. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="modal-overlay">
      <div className="modal-content glass fade-in">
        <button onClick={handleClose} className="close-btn">
          <X size={24} />
        </button>
        {isOrdered ? (
          <div className="success-message fade-in">
            <div className="success-icon-container">
              <div className="success-circle"></div>
              <CheckCircle size={80} className="check-icon" />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669', marginBottom: '0.75rem' }}>شكراً ليكم على ثقتكم في naslmla7 ❤️</h2>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1rem' }}>
              توصلنا بالطلب ديالكم بنجاح. فريقنا غادي يتواصل معاكم في مكالمة هاتفية في أقل من 20 ساعة باش نأكدوا المعلومات ونصيفطوا ليكم السلعة.
            </p>
            
            <div style={{
              margin: '1.5rem 0',
              padding: '1.25rem',
              background: '#f8fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '1rem',
              textAlign: 'center'
            }}>
              <span style={{ display: 'block', fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>رقم الطلب المرجعي:</span>
              <span className="numerals" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px' }}>
                NL-{Math.floor(Math.random() * 90000) + 10000}
              </span>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              padding: '1.5rem',
              borderRadius: '1rem',
              margin: '1.5rem 0',
              color: 'white',
              boxShadow: '0 10px 20px rgba(30, 41, 59, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}>
               <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontWeight: '800', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  ⭐ نظام الأولوية الحصرية
                </p>
                <p style={{ fontSize: '0.95rem', opacity: '0.9', lineHeight: '1.6' }}>
                  نظرًا للطلب المتزايد، قمنا بحجز منتجك فوراً ومنحه <strong>أولوية التجهيز</strong>. طلبك محمي الآن وسيتم الاتصال بك خلال دقائق لتأكيد التوصيل.
                </p>
              </div>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.1 }}>
                <CheckCircle size={100} />
              </div>
            </div>

            <div className="status-badge">
              <span className="status-dot"></span>
              جاري تجهيز طلبك للشحن الآن
            </div>

            <button onClick={handleClose} className="btn btn-primary" style={{ marginTop: '1.5rem', width: '100%', padding: '1.25rem', fontSize: '1.1rem' }}>
               إغلاق ومتابعة التصفح
            </button>
          </div>
        ) : (
          <>
            <h2 className="modal-title">إتمام الشراء</h2>
            <div className="order-summary" style={isCartCheckout ? {flexDirection: 'column', alignItems: 'flex-start'} : {}}>
              {isCartCheckout ? (
                <div style={{width: '100%'}}>
                  <h4 style={{marginBottom: '0.5rem'}}>ملخص السلة ({checkoutItems.length} منتجات)</h4>
                  <ul style={{listStyle: 'none', padding: 0, maxHeight: '100px', overflowY: 'auto', marginBottom: '0.5rem'}}>
                    {checkoutItems.map((item, idx) => (
                      <li key={idx} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.25rem'}}>
                        <span>{item.name}</span>
                        <span>{item.hasPromo && new Date(item.promoEndDate) > new Date() ? item.promoPrice : item.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div style={{borderTop: '1px solid var(--border)', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold'}}>
                     <span>المجموع الكلي:</span>
                     <span style={{color: '#ef4444'}}>{totalPrice} MAD</span>
                  </div>
                </div>
              ) : (
                <>
                  <img src={product.image} alt={product.name} className="summary-img" />
                  <div>
                    <h4>{product.name}</h4>
                    {product.hasPromo && product.promoPrice && product.promoEndDate && new Date(product.promoEndDate) > new Date() ? (
                      <div className="price">
                        <span className="numerals" style={{color: '#ef4444'}}>{product.promoPrice}</span> MAD
                        <span className="numerals" style={{textDecoration: 'line-through', color: '#9ca3af', fontSize: '0.875em', marginRight: '0.5rem'}}>{product.price}</span>
                      </div>
                    ) : (
                      <p className="price"><span className="numerals">{product.price}</span> MAD</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label>الاسم الكامل</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder=""
                  value={formData.fullName}
                  onChange={handleChange}
                  style={errors.fullName ? {borderColor: '#ef4444'} : {}}
                />
                {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label>رقم الهاتف</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  dir="ltr"
                  placeholder=""
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={10}
                  style={errors.phone ? {borderColor: '#ef4444'} : {}}
                />
                {errors.phone && <span className="error-msg">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>العنوان</label>
                <textarea
                  name="address"
                  required
                  placeholder=""
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  style={errors.address ? {borderColor: '#ef4444'} : {}}
                ></textarea>
                {errors.address && <span className="error-msg">{errors.address}</span>}
              </div>
              <button 
                type="submit" 
                className="btn btn-primary submit-btn"
                disabled={isSubmitting}
                style={{ opacity: isSubmitting ? 0.7 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
              >
                <span>{isSubmitting ? 'جاري الإرسال...' : 'إتمام الشراء الآن'}</span>
                {!isSubmitting && <Send size={18} />}
              </button>
              {isSubmitting && (
                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '1rem', 
                  color: 'var(--primary)', 
                  fontWeight: 'bold',
                  animation: 'pulse 1.5s infinite' 
                }}>
                  ⏳ المرجو الانتظار، جاري إرسال معلوماتك...
                </p>
              )}
              <div style={{
                marginTop: '1.5rem',
                textAlign: 'center',
                padding: '1rem',
                background: '#f0fdf4',
                border: '1px dashed #166534',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                color: '#166534',
                fontSize: '0.9rem',
                fontWeight: 600
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><path d="M6 15h.01"/><path d="M10 15h.01"/></svg>
                <span>الدفع نقدًا عند استلام المنتج</span>
              </div>
            </form>
          </>
        )}
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          backdrop-filter: blur(5px);
          padding: 1rem;
        }
        .modal-content {
          background: var(--surface);
          width: 95vw;
          max-width: 500px;
          padding: 1.5rem;
          border-radius: 1.5rem;
          position: relative;
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          overflow-y: auto;
        }
        @media (min-width: 480px) {
          .modal-content {
            padding: 2rem;
            width: 100%;
          }
        }
        .close-btn {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          background: transparent;
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: 50%;
        }
        .close-btn:hover {
          background: rgba(0,0,0,0.05);
          color: var(--text-main);
        }
        .modal-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 2rem;
          text-align: center;
        }
        .order-summary {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: var(--background);
          padding: 1rem;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
        }
        .summary-img {
          width: 60px;
          height: 60px;
          object-fit: cover;
          border-radius: 0.5rem;
        }
        .price {
          color: var(--primary);
          font-weight: 700;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-main);
        }
        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.3s ease;
          outline: none;
        }
        .form-group input:focus,
        .form-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        .submit-btn {
          width: 100%;
          justify-content: center;
          margin-top: 1rem;
        }
        .success-message {
          text-align: center;
          padding: 1rem 0;
        }
        .success-icon-container {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .success-circle {
          position: absolute;
          width: 100%;
          height: 100%;
          background: #dcfce7;
          border-radius: 50%;
          animation: scaleUp 0.5s ease-out forwards;
        }
        .check-icon {
          color: #059669;
          position: relative;
          z-index: 1;
          animation: checkAppear 0.5s 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
        }
        @keyframes scaleUp {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes checkAppear {
          from { transform: scale(0) rotate(-45deg); opacity: 0; }
          to { transform: scale(1) rotate(0); opacity: 1; }
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #f0fdf4;
          color: #166534;
          padding: 0.5rem 1rem;
          border-radius: 2rem;
          font-weight: 700;
          font-size: 0.9rem;
          margin: 1rem 0;
          border: 1px solid #bbf7d0;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(34, 197, 94, 0.4);
          animation: pulse-dot 1.5s infinite;
        }
        @keyframes pulse-dot {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .success-message h3 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          color: #1e293b;
        }
        .success-message p {
          color: var(--text-secondary);
          line-height: 1.6;
        }
        .error-msg {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }
      `}</style>
    </div>
  );
};
export default CheckoutModal;
