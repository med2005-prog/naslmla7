import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'الرجاء إدخال اسم المنتج'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'الرجاء إدخال سعر المنتج']
  },
  description: {
    type: String,
    required: [true, 'الرجاء إدخال وصف المنتج']
  },
  fullDescription: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'عام'
  },
  image: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  videoUrl: {
    type: String,
    default: ''
  },
  hasPromo: {
    type: Boolean,
    default: false
  },
  promoPrice: {
    type: Number
  },
  promoEndDate: {
    type: Date
  },
  reviews: [
    {
      name: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;
