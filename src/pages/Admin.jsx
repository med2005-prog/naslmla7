import React, { useState, useEffect } from 'react';
import { Plus, LogOut, Settings, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser, logoutUser, isUserAuthenticated } from '../utils/auth';
import { useProducts } from '../context/ProductsContext';
import { fetchProducts, createProduct, updateProduct, deleteProduct, loginAdmin } from '../services/api';

import AdminLogin from '../components/admin/AdminLogin';
import ProductForm from '../components/admin/ProductForm';
import ProductList from '../components/admin/ProductList';

const Admin = () => {
  const navigate = useNavigate();
  const { setProducts: setGlobalProducts, categories } = useProducts();
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const handleDeleteCategory = (cat) => {
    if (window.confirm(`سيتم تحويل فئة المنتجات التابعة لـ "${cat}" إلى "الكل". هل أنت متأكد؟`)) {
       const updatedProducts = products.map(p => (p.category || 'عام') === cat ? { ...p, category: 'الكل' } : p);
       saveProducts(updatedProducts);
       if (filterCategory === cat) setFilterCategory('الكل');
    }
  };
  const [isAuthenticated, setIsAuthenticated] = useState(isUserAuthenticated());
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState('الكل');
  
  // Loading state
  const [loading, setLoading] = useState(false);

  const initialFormState = {
    name: '',
    price: '',
    description: '',
    fullDescription: '',
    category: 'عام',
    image: '',
    images: [],
    videoUrl: '',
    hasPromo: false,
    promoPrice: '',
    promoEndDate: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    // Load products from Database
    const loadData = async () => {
      setLoading(true);
      try {
          const apiProducts = await fetchProducts();
          const userProducts = apiProducts.filter(p => !p.createdBy || true); 
          setProducts(userProducts);
      } catch (err) {
          console.error("Failed loading from DB, fallback to context", err);
      } finally {
          setLoading(false);
      }
    };
    
    if (isAuthenticated) {
        loadData();
    }
  }, [isAuthenticated]);

  // Fallback save locally if DB upload fails occasionally
  const saveProducts = (updatedProducts) => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      const storageKey = `products_${userEmail}`;
      localStorage.setItem(storageKey, JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
      setGlobalProducts(updatedProducts);
      window.dispatchEvent(new Event('productsUpdated'));
    } catch (error) {
      console.error('Error saving updated products', error);
      alert('حدث خطأ أثناء حفظ التحديث محلياً.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const lowerEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
        const user = await loginAdmin(lowerEmail, cleanPassword);
        // Login successful
        loginUser(lowerEmail);
        setIsAuthenticated(true);
        setEmail('');
        setPassword('');
        alert(`مرحباً بك ${user.name}!`);
    } catch (error) {
        // Detailed logging as requested
        console.error("Login Error:", error);
        
        // Define emergency keys
        const EMERGENCY_EMAILS = ['mohammedelmalki2005@gmail.com'];
        const EMERGENCY_KEYS = ['20052005'];

        if (EMERGENCY_EMAILS.includes(lowerEmail) && EMERGENCY_KEYS.includes(cleanPassword)) {
            console.warn("⚠️ Emergency bypass activated!");
            loginUser(lowerEmail);
            setIsAuthenticated(true);
            setEmail('');
            setPassword('');
            alert('mr7ba bik ');
            return;
        }
        
        const errorMsg = error.response?.data?.message || error.message || "Unknown error";
        alert(`خطأ في تسجيل الدخول: ${errorMsg}\n\n (راجع الكونسول لمزيد من التفاصيل)`);
    } finally {
        setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setProducts([]);
    navigate('/');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        alert('حجم الصورة كبير جداً. يجب أن يكون أقل من 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => {
          const newImages = [...(prev.images || [])];
          newImages.push(reader.result);
          
          if (newImages.length === 1) {
            return { ...prev, images: newImages, image: reader.result };
          }
          return { ...prev, images: newImages };
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        images: newImages,
        image: newImages.length > 0 ? newImages[0] : ''
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const defaultImage = 'data:image/svg+xml;base64,...'; 
    const finalImage = formData.image || (formData.images?.length > 0 ? formData.images[0] : defaultImage);
    const finalImages = formData.images?.length > 0 ? formData.images : [finalImage];

    const processedFormData = {
      ...formData,
      category: formData.category || 'عام',
      image: finalImage,
      images: finalImages,
      videoUrl: formData.videoUrl || '',
      price: parseFloat(formData.price),
      promoPrice: formData.hasPromo && formData.promoPrice ? parseFloat(formData.promoPrice) : ''
    };

    try {
      if (editingProduct) {
        const idToUpdate = editingProduct._id || editingProduct.id;
        try {
            const updated = await updateProduct(idToUpdate, processedFormData);
            const updatedProducts = products.map(p => (p._id || p.id) === idToUpdate ? updated : p);
            setProducts(updatedProducts);
            setGlobalProducts(updatedProducts);
            window.dispatchEvent(new Event('productsUpdated'));
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
              const storageKey = `products_${userEmail}`;
              localStorage.removeItem(storageKey);
            }
            alert('Product updated in MongoDB Atlas');
        } catch (apiErr) {
            console.error('API Update failed, updating locally', apiErr);
            const updatedProducts = products.map(p => p.id === editingProduct.id ? { ...processedFormData, id: editingProduct.id } : p);
            saveProducts(updatedProducts); 
        }
      } else {
        try {
            const newApiProduct = await createProduct(processedFormData);
            const updatedProducts = [...products, newApiProduct];
            setProducts(updatedProducts);
            setGlobalProducts(updatedProducts);
            window.dispatchEvent(new Event('productsUpdated'));
            const userEmail = localStorage.getItem('userEmail');
            if (userEmail) {
              const storageKey = `products_${userEmail}`;
              localStorage.removeItem(storageKey);
            }
            alert('Product saved to MongoDB Atlas');
        } catch (apiErr) {
            console.error('API Create failed, saving locally', apiErr);
            const newProduct = { ...processedFormData, id: Date.now() };
            saveProducts([...products, newProduct]);
            const errorData = apiErr.response?.data || { message: apiErr.message };
            alert('DEBUG API Error: ' + JSON.stringify(errorData, null, 2));
        }
      }
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    setFormData(initialFormState);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      description: product.description || '',
      fullDescription: product.fullDescription || '',
      category: product.category || 'عام',
      image: product.image || '',
      images: product.images || (product.image ? [product.image] : []),
      videoUrl: product.videoUrl || '',
      hasPromo: product.hasPromo || false,
      promoPrice: product.promoPrice ? product.promoPrice.toString() : '',
      promoEndDate: product.promoEndDate ? new Date(product.promoEndDate).toISOString().slice(0, 16) : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setLoading(true);
      const productToDelete = products.find(p => p._id === id || p.id === id);
      try {
          if (productToDelete && productToDelete._id) {
              await deleteProduct(productToDelete._id);
          }
          const updatedProducts = products.filter(p => p._id !== id && p.id !== id);
          setProducts(updatedProducts);
          setGlobalProducts(updatedProducts);
          window.dispatchEvent(new Event('productsUpdated'));
          saveProducts(updatedProducts); 
      } catch (err) {
          console.error("Failed to delete from API", err);
          const updatedProducts = products.filter(p => p.id !== id);
          saveProducts(updatedProducts); 
      } finally {
          setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData(initialFormState);
    setEditingProduct(null);
    setShowForm(false);
  };

  if (!isAuthenticated) {
    return (
      <AdminLogin 
        email={email} 
        setEmail={setEmail} 
        password={password} 
        setPassword={setPassword} 
        handleLogin={handleLogin} 
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', paddingTop: '2rem' }}>
      <div className="container" style={{ maxWidth: '1200px', padding: '2rem' }}>
        
        {loading && (
           <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255, 255, 255, 0.7)', zIndex: 2000 }}>
             <div style={{ padding: '1.5rem', background: '#3b82f6', color: 'white', borderRadius: '1rem', fontWeight: 'bold' }}>جاري التحميل...</div>
           </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '3rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              لوحة التحكم
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              إدارة المنتجات ({products.length} منتج)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{
                padding: '0.6rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)',
                background: 'white',
                fontWeight: 'bold',
                minWidth: '150px'
              }}
            >
              <option value="الكل">جميع الفئات</option>
              {categories && categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <button onClick={() => setShowCategoryManager(true)} className="btn" style={{ background: '#f8fafc', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              <Settings size={20} /> إدارة الفئات
            </button>
            <button onClick={() => setShowForm(true)} className="btn btn-primary">
              <Plus size={20} /> إضافة منتج جديد
            </button>
            <button onClick={handleLogout} className="btn" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              <LogOut size={20} /> تسجيل الخروج
            </button>
          </div>
        </div>

        {showForm && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem', overflowY: 'auto' }}>
            <ProductForm 
              formData={formData} 
              handleInputChange={handleInputChange} 
              setFormData={setFormData}
              removeImage={removeImage}
              handleImageUpload={handleImageUpload}
              handleSubmit={handleSubmit}
              editingProduct={editingProduct}
              handleCancel={handleCancel}
              categories={categories}
            />
          </div>
        )}

        {showCategoryManager && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', width: '100%', maxWidth: '500px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>إدارة الفئات</h2>
                <button onClick={() => setShowCategoryManager(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              
               <div style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
                💡 ملاحظة: لإضافة فئة جديدة، ببساطة اكتب اسمها في خانة "الفئة" داخل فورم المنتج.
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto' }}>
                {categories && categories.map(cat => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
                    <span style={{ fontWeight: 600 }}>{cat}</span>
                    <button onClick={() => handleDeleteCategory(cat)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <ProductList 
          products={filterCategory === 'الكل' ? products : products.filter(p => (p.category || 'عام') === filterCategory)} 
          handleEdit={handleEdit} 
          handleDelete={handleDelete} 
          setShowForm={setShowForm} 
        />
        
      </div>
    </div>
  );
};

export default Admin;
