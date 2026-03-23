import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Admin from './pages/Admin';
import AboutUs from './pages/AboutUs';
import { CartProvider } from './context/CartContext';
import { ProductsProvider } from './context/ProductsContext';
function App() {
  return (
    <CartProvider>
      <ProductsProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/about" element={<AboutUs />} />

            </Routes>
          </Layout>
        </Router>
      </ProductsProvider>
    </CartProvider>
  );
}
export default App;
