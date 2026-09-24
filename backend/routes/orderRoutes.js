const router = require('express').Router();
const controller = require('../controllers/orderController');
const { requireAuth } = require('../middleware/auth');

router.post('/orders', controller.create);
router.get('/orders', requireAuth, controller.list);

module.exports = router;
