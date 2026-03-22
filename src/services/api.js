const API_URL = import.meta.env.VITE_API_URL || '/api';

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

export const loginAdmin = async (email, password) => {
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (data.success) {
            localStorage.setItem('token', data.token);
            return data.data;
        }
        throw new Error(data.message || 'فشل تسجيل الدخول');
    } catch (error) {
        throw error;
    }
};

export const fetchProducts = async () => {
    try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success) {
            return data.data; // Array of products
        }
        throw new Error(data.message || 'Failed to fetch products');
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
};

export const createProduct = async (productData) => {
    try {
        // We will mock the auth for this since we didn't fully implement frontend JWT yet
        // A real app would send authorization header
        // For development, we'll try sending the user email as a workaround or just see if the backend allows it (currently admin restricted)
        // Wait, the backend requires an actual mock user id or we just temporarily bypass it if it's strict.
        // Actually, we need to pass a valid JWT. For now let's hope it works or we edit the backend.
        
        // As a temporary fix since frontend doesn't have a real JWT yet in this session,
        // let's just make the request. If it fails due to auth, we'll see.
        const res = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        throw new Error(data.message || 'Failed to create product');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(productData)
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        throw new Error(data.message || 'Failed to update product');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (data.success) {
            return true;
        }
        throw new Error(data.message || 'Failed to delete product');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const createOrder = async (orderData) => {
    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const data = await res.json();
        if (data.success) {
            return data.data;
        }
        throw new Error(data.message || 'فشل إرسال الطلب');
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};
