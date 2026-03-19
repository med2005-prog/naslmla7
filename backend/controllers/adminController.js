import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';



/**
 * @desc    Get basic dashboard stats for current admin
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const adminId = req.user._id;

    // Aggregation for specific admin
    const productStats = await Product.aggregate([
      { $match: { createdBy: adminId } },
      {
        $group: {
          _id: '$createdBy',
          numProducts: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const salesStats = await Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: '$orderItems' },
      {
        $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $match: { 'product.createdBy': adminId } },
      {
        $group: {
          _id: '$product.createdBy',
          totalSales: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        numProducts: productStats[0] ? productStats[0].numProducts : 0,
        avgRating: productStats[0] ? parseFloat(productStats[0].avgRating.toFixed(1)) : 0,
        totalSales: salesStats[0] ? salesStats[0].totalSales : 0
      }
    });
  } catch (error) {
    next(error);
  }
};
