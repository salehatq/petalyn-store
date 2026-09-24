const crypto = require('crypto');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function ensureCsrfCookie(req, res, next) {
  if (!req.cookies?.petalyn_csrf) {
    res.cookie('petalyn_csrf', crypto.randomBytes(32).toString('hex'), {
      httpOnly: false,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.COOKIE_DOMAIN || undefined,
      maxAge: 1000 * 60 * 60 * 24
    });
  }
  next();
}

function requireCsrf(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const cookieToken = req.cookies?.petalyn_csrf;
  const headerToken = req.get('x-csrf-token');
  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return res.status(403).json({ message: 'Invalid security token. Refresh and try again.' });
  }
  next();
}

module.exports = { ensureCsrfCookie, requireCsrf };
