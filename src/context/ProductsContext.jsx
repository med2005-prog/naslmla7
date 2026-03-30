import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { products as defaultProducts } from '../data/products';
import { fetchProducts } from '../services/api';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Categories state - persistent from cache and then updated from DB
  const [categories, setCategories] = useState(() => {
    try {
        const saved = localStorage.getItem('app_categories_cache');
        return saved ? JSON.parse(saved) : ["عام"];
    } catch {
        return ["عام"];
    }
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
        const fetchedProducts = await fetchProducts() || [];
        
        // Find the hidden global categories configuration product
        const categoriesConfig = fetchedProducts.find(p => p.name === '__GLOBAL_CATEGORIES__');
        
        if (categoriesConfig && categoriesConfig.description) {
            try {
                const dbCategories = JSON.parse(categoriesConfig.description);
                if (dbCategories && dbCategories.length > 0) {
                    setCategories(dbCategories);
                    localStorage.setItem('app_categories_cache', JSON.stringify(dbCategories));
                }
            } catch (e) {
                console.error("Failed to parse categories from DB", e);
            }
        }

        // Filter out the config record from the public products list
        const actualProducts = fetchedProducts.filter(p => p.name !== '__GLOBAL_CATEGORIES__');
        
        if (actualProducts.length > 0) {
            setProducts(actualProducts);
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

  // Function to sync current categories list to the database globally
  const syncCategoriesToDB = async (newList) => {
    try {
        // Save to local cache immediately so it's there on refresh even during network lag
        localStorage.setItem('app_categories_cache', JSON.stringify(newList));
        setCategories(newList);
        
        const allProducts = await fetchProducts() || [];
        const existingConfig = allProducts.find(p => p.name === '__GLOBAL_CATEGORIES__');
        
        const configData = {
            name: '__GLOBAL_CATEGORIES__',
            description: JSON.stringify(newList),
            category: 'HIDDEN',
            price: 1, 
            image: ''
        };

        if (existingConfig) {
            await updateProduct(existingConfig._id || existingConfig.id, configData);
        } else {
            await createProduct(configData);
        }
        
        return true;
    } catch (err) {
        console.error("Failed to sync categories to DB", err);
        return false;
    }
  };

  useEffect(() => {
    loadProducts();

    const handleUpdate = () => loadProducts();
    window.addEventListener('productsUpdated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [loadProducts]);

  return (
    <ProductsContext.Provider value={{ products, loading, setProducts, loadProducts, categories, setCategories, syncCategoriesToDB }}>
      {children}
    </ProductsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => useContext(ProductsContext);
