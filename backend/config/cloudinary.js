const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

function publicIdFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    const marker = '/upload/';
    const index = pathname.indexOf(marker);
    if (index === -1) return null;
    let value = pathname.slice(index + marker.length).replace(/^v\d+\//, '');
    value = value.replace(/\.[^/.]+$/, '');
    return value || null;
  } catch {
    return null;
  }
}

module.exports = cloudinary;
module.exports.publicIdFromUrl = publicIdFromUrl;
