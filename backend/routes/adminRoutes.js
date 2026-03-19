import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { getAdminStats } from '../controllers/adminController.js';

const router = express.Router();

// ============================================
// DASHBOARD STATS
// ============================================

/**
 * @desc    Get dashboard statistics (Personal stats for logged in admin)
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
router.get('/stats', protect, authorize('admin'), getAdminStats);



// ============================================
// PRODUCT ROUTES (Example/Placeholder)
// ============================================
// ... (Keep existing product/order routes or replace with real ones if controllers exist)
// For now, keeping placeholders as we only implemented stats controller
router.get('/products', protect, authorize('admin'), (req, res) => {
    res.json({ success: true, message: 'Products endpoint' }); 
});
// ... other routes

export default router;

