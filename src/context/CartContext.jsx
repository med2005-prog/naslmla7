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
  const addToCart = (product) => {
    setItems(prev => [...prev, product]);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };
  const clearCart = () => {
    setItems([]);
  };
  const removeFromCart = (indexToRemove) => {
    setItems(prevItems => prevItems.filter((_, index) => index !== indexToRemove));
  };
  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, cartCount: items.length, isAnimating, clearCart }}>
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
