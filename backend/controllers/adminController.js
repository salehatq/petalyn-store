const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  domain: process.env.COOKIE_DOMAIN || undefined,
  maxAge: 1000 * 60 * 60 * 8
});

const csrfCookieOptions = () => ({
  httpOnly: false,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production',
  domain: process.env.COOKIE_DOMAIN || undefined,
  maxAge: 1000 * 60 * 60 * 24
});

function publicAdmin(admin) {
  return { _id: admin._id, name: admin.name, email: admin.email };
}

exports.login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required' });

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { sub: String(admin._id), email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    const csrf = crypto.randomBytes(32).toString('hex');

    res.cookie('petalyn_token', token, cookieOptions());
    res.cookie('petalyn_csrf', csrf, csrfCookieOptions());
    res.json({ success: true, admin: publicAdmin(admin) });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.sub);
    if (!admin) return res.status(401).json({ message: 'Admin account not found' });
    res.json({ admin: publicAdmin(admin) });
  } catch (error) {
    next(error);
  }
};

exports.logout = async (_req, res, next) => {
  try {
    const options = { ...cookieOptions(), maxAge: 0 };
    res.clearCookie('petalyn_token', options);
    res.clearCookie('petalyn_csrf', { ...csrfCookieOptions(), maxAge: 0 });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};
