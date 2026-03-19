import React from 'react';
import { X, Save, Upload } from 'lucide-react';

const ProductForm = ({
  formData,
  handleInputChange,
  setFormData,
  removeImage,
  handleImageUpload,
  handleSubmit,
  editingProduct,
  handleCancel
}) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      maxWidth: '600px',
      width: '95vw',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
          {editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
        </h2>
        <button
          type="button"
          onClick={handleCancel}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={24} />
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* اسم المنتج */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              اسم المنتج
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          {/* السعر */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              السعر (درهم)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>

          {/* الوصف المختصر */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              الوصف المختصر
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '1rem'
              }}
              required
            />
          </div>
          {/* الوصف الكامل */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              الوصف الكامل
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleInputChange}
              rows="4"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid var(--border)',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                resize: 'vertical'
              }}
              required
            />
          </div>
          {/* العرض الترويجي */}
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '0.75rem',
            border: '2px solid #fbbf24'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="hasPromo"
                checked={formData.hasPromo}
                onChange={(e) => setFormData(prev => ({ ...prev, hasPromo: e.target.checked }))}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer'
                }}
              />
              <label htmlFor="hasPromo" style={{ fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', color: '#92400e' }}>
                🎉 تفعيل عرض ترويجي
              </label>
            </div>
            {formData.hasPromo && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#92400e' }}>
                    سعر العرض (درهم)
                  </label>
                  <input
                    type="number"
                    name="promoPrice"
                    value={formData.promoPrice}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #fbbf24',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#92400e' }}>
                    تاريخ انتهاء العرض
                  </label>
                  <input
                    type="datetime-local"
                    name="promoEndDate"
                    value={formData.promoEndDate}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '2px solid #fbbf24',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  />
                </div>
                {formData.price && formData.promoPrice && (
                  <div style={{
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: '0.5rem',
                    textAlign: 'center'
                  }}>
                    <p style={{ fontWeight: 700, color: '#92400e' }}>
                      💰 التوفير: <span className="numerals">{parseFloat(formData.price) - parseFloat(formData.promoPrice)}</span> درهم
                      ({Math.round(((parseFloat(formData.price) - parseFloat(formData.promoPrice)) / parseFloat(formData.price)) * 100)}%)
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* رفع الصور */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
              صور المنتج (يمكنك اختيار عدة صور)
            </label>
            
            {formData.images && formData.images.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                {formData.images.map((img, index) => (
                  <div key={index} style={{ position: 'relative', aspectRatio: '1/1' }}>
                    <img 
                      src={img} 
                      alt={`Preview ${index}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: 'absolute',
                        top: '-0.5rem',
                        right: '-0.5rem',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}
                    >
                      <X size={12} />
                    </button>
                    {index === 0 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        background: 'rgba(99, 102, 241, 0.8)',
                        color: 'white',
                        fontSize: '0.6rem',
                        textAlign: 'center',
                        padding: '0.2rem',
                        borderBottomLeftRadius: '0.5rem',
                        borderBottomRightRadius: '0.5rem'
                      }}>
                        الصورة الأساسية
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{
              border: '2px dashed var(--border)',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'var(--background)'
            }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
                multiple
              />
              <label htmlFor="image-upload" style={{ cursor: 'pointer', display: 'block' }}>
                <div>
                  <Upload size={40} color="var(--text-secondary)" style={{ margin: '0 auto' }} />
                  <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    اضغط لرفع صور إضافية
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    يمكنك رفع عدة صور في آن واحد
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* رابط فيديو يوتيوب */}
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 0, 0, 0.05)',
            borderRadius: '0.75rem',
            border: '2px solid rgba(255, 0, 0, 0.2)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontWeight: 700, color: '#cc0000' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              رابط فيديو يوتيوب (اختياري)
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #ff000033',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                background: 'white'
              }}
            />
            <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
              سيظهر الفيديو في صفحة تفاصيل المنتج لإبراز مميزاته.
            </p>
          </div>
          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <Save size={20} />
              {editingProduct ? 'حفظ التعديلات' : 'إضافة المنتج'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn"
              style={{
                flex: 1,
                background: '#f1f5f9',
                color: '#64748b'
              }}
            >
              إلغاء
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
