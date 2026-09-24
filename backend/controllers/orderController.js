const Order = require('../models/Order');
const Product = require('../models/Product');

exports.create = async (req, res, next) => {
  try {
    const { cart, address } = req.body;
    const cleanAddress = String(address || '').trim();
    if (!Array.isArray(cart) || !cart.length || cart.length > 50 || !cleanAddress) {
      return res.status(400).json({ message: 'Cart and delivery address are required' });
    }
    if (cleanAddress.length > 500) return res.status(400).json({ message: 'Delivery address is too long' });

    const ids = cart.map(item => item?._id).filter(Boolean);
    if (!ids.length) return res.status(400).json({ message: 'Cart contains no valid products' });

    const products = await Product.find({ _id: { $in: ids } }).lean();
    const byId = new Map(products.map(product => [String(product._id), product]));
    let total = 0;
    const lineItems = [];

    for (const item of cart) {
      const product = byId.get(String(item?._id));
      const quantity = Math.floor(Number(item?.quantity));
      if (!product) return res.status(400).json({ message: 'One or more products are no longer available' });
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
        return res.status(400).json({ message: 'Invalid product quantity' });
      }
      total += product.price * quantity;
      lineItems.push({ productId: product._id, quantity });
    }

    const order = await Order.create({ products: lineItems, totalAmount: Math.round(total * 100) / 100, address: cleanAddress });
    res.status(201).json({ order: { _id: order._id, totalAmount: order.totalAmount, status: order.status, createdAt: order.createdAt } });
  } catch (error) { next(error); }
};

exports.list = async (_req, res, next) => {
  try {
    const orders = await Order.find().populate('products.productId').sort({ createdAt: -1 }).lean();
    res.json({ orders });
  } catch (error) { next(error); }
};
