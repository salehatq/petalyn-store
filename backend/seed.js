require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Product = require('./models/Product');
const Admin = require('./models/Admin');

const products = [
  { title: 'Sun Flower', des: 'Bright, sunny and effortlessly cheerful.', price: 120, image: '/Images/1.jpg' },
  { title: 'Lily Flower', des: 'Soft petals with a calm, elegant feel.', price: 120, image: '/Images/2.jpg' },
  { title: 'Rose Flower', des: 'A timeless classic for saying it beautifully.', price: 120, image: '/Images/3.jpg' },
  { title: 'Moon Flower', des: 'A delicate arrangement with a little mystery.', price: 180, image: '/Images/4.jpg' }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});

  const baseUrl = (process.env.SEED_IMAGE_BASE_URL || 'http://localhost:5173').replace(/\/$/, '');
  await Product.insertMany(products.map(product => ({ ...product, image: `${baseUrl}${product.image}` })));

  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    if (process.env.ADMIN_PASSWORD.length < 12) throw new Error('ADMIN_PASSWORD must be at least 12 characters');
    const password = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await Admin.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL.toLowerCase() },
      { name: 'Administrator', email: process.env.ADMIN_EMAIL.toLowerCase(), password },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
  console.log('Seed complete');
}

seed().catch(error => {
  console.error(error);
  process.exitCode = 1;
}).finally(async () => {
  await mongoose.disconnect();
});
