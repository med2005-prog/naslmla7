import React, { createContext, useContext, useState } from 'react';
const CartContext = createContext();
export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem('cartItems');
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });
  const [isAnimating, setIsAnimating] = useState(false);
  React.useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);
  const addToCart = (product, quantity = 1) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => (item._id || item.id) === (product._id || product.id));
      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex] = { ...newItems[existingIndex], quantity: (newItems[existingIndex].quantity || 1) + quantity };
        return newItems;
      }
      return [...prev, { ...product, quantity: quantity }];
    });
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };
  const clearCart = () => {
    setItems([]);
  };
  const removeFromCart = (productId) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => (item._id || item.id) === productId);
      if (existingIndex >= 0) {
        const item = prevItems[existingIndex];
        if (item.quantity > 1) {
          const newItems = [...prevItems];
          newItems[existingIndex] = { ...item, quantity: item.quantity - 1 };
          return newItems;
        } else {
          return prevItems.filter((_, index) => index !== existingIndex);
        }
      }
      return prevItems;
    });
  };
  const cartCount = items.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, cartCount, isAnimating, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
