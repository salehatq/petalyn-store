const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  des: { type: String, required: true, trim: true, maxlength: 500 },
  price: { type: Number, required: true, min: 0, max: 10000000 },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', schema);
