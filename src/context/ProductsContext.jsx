import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as defaultProducts } from '../data/products';
import { fetchProducts } from '../services/api';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Automatically derive unique categories from the products list to ensure global sync across all users
  const categories = products && products.length > 0 
    ? [...new Set(products.map(p => p.category || 'الكل'))].filter(cat => cat !== 'الكل')
    : [];

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
        const fetchedProducts = await fetchProducts();
        
        // Also grab local products if any were made by admin before connection
        const localProducts = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('products_')) {
            try {
              const adminProducts = JSON.parse(localStorage.getItem(key));
              if (Array.isArray(adminProducts)) {
                localProducts.push(...adminProducts);
              }
            } catch (err) {}
          }
        }
        
        // Priority to backend data, fallback to local or default if nothing
        if (fetchedProducts && fetchedProducts.length > 0) {
            setProducts(fetchedProducts);
        } else if (localProducts.length > 0) {
            setProducts(localProducts);
        } else {
            setProducts(defaultProducts);
        }
    } catch(err) {
        console.error('Failed to load products from API', err);
        setProducts(defaultProducts);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      loadProducts();
    }, 0);

    const handleUpdate = () => loadProducts();
    window.addEventListener('productsUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadProducts]);

  return (
    <ProductsContext.Provider value={{ products, loading, setProducts, loadProducts, categories }}>
      {children}
    </ProductsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductsContext);
