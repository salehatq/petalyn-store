const router = require('express').Router();
const upload = require('../middleware/upload');
const controller = require('../controllers/productController');
const { requireAuth } = require('../middleware/auth');
const { requireCsrf } = require('../middleware/csrf');

router.get('/products', controller.list);
router.get('/products/:id', controller.get);
router.post('/products', requireAuth, requireCsrf, upload.single('image'), controller.create);
router.put('/products/:id', requireAuth, requireCsrf, upload.single('image'), controller.update);
router.delete('/products/:id', requireAuth, requireCsrf, controller.remove);

module.exports = router;
