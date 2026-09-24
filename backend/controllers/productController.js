const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');

function productPayload(body) {
  const title = String(body.title || '').trim();
  const des = String(body.des || '').trim();
  const price = Number(body.price);
  if (!title || title.length > 120) throw Object.assign(new Error('Product name is required and must be 120 characters or fewer'), { status: 400 });
  if (!des || des.length > 500) throw Object.assign(new Error('Product description is required and must be 500 characters or fewer'), { status: 400 });
  if (!Number.isFinite(price) || price < 0) throw Object.assign(new Error('Product price must be a valid non-negative number'), { status: 400 });
  return { title, des, price: Math.round(price * 100) / 100 };
}

exports.list = async (_req, res, next) => {
  try { res.json({ products: await Product.find().sort({ createdAt: -1 }).lean() }); }
  catch (error) { next(error); }
};

exports.get = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.file?.path) return res.status(400).json({ message: 'Product image is required' });
    const product = await Product.create({ ...productPayload(req.body), image: req.file.path });
    res.status(201).json({ product });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const data = productPayload(req.body);
    if (req.file?.path) data.image = req.file.path;
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found' });
    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      returnDocument: 'after',
      runValidators: true
    });
    if (req.file?.path && existing.image) {
      const publicId = cloudinary.publicIdFromUrl(existing.image);
      if (publicId) cloudinary.uploader.destroy(publicId).catch(error => console.warn('Old Cloudinary image cleanup failed:', error.message));
    }
    res.json({ product });
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    const publicId = cloudinary.publicIdFromUrl(product.image);
    if (publicId) cloudinary.uploader.destroy(publicId).catch(error => console.warn('Cloudinary image cleanup failed:', error.message));
    res.json({ message: 'Product deleted' });
  } catch (error) { next(error); }
};
