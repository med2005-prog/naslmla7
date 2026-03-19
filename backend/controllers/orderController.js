import Order from '../models/Order.js';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Public (Guest users)
 */
export const addOrderItems = async (req, res, next) => {
  try {
    const { orderItems, customerInfo, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لا توجد طلبات'
      });
    }

    const order = new Order({
      orderItems,
      customerInfo,
      totalPrice,
      status: 'pending',
      isPaid: false,
      isDelivered: false
    });

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all orders
 * @route   GET /api/orders
 * @access  Private/Admin
 */
export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};
