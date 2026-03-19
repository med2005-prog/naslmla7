import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // معلومات الزبون كزائر (Guest)
  customerInfo: {
    fullName: { type: String, required: [true, 'الرجاء إدخال الاسم الكامل'] },
    phone: { type: String, required: [true, 'الرجاء إدخال رقم الهاتف'] },
    address: { type: String, required: [true, 'الرجاء إدخال العنوان'] }
  },
  
  // المنتجات المطلوبة
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        // Not required strictly just in case local products exist without DB ID, but good practice
        required: false
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String }
    }
  ],
  
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  
  // تتبع حالة الطلب
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  
  paidAt: {
    type: Date
  },
  
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  
  deliveredAt: {
    type: Date
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
