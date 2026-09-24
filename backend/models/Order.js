const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1, max: 99 }
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', schema);
