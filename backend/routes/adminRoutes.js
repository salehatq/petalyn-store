const router = require('express').Router();
const controller = require('../controllers/adminController');
const { requireAuth } = require('../middleware/auth');
const { requireCsrf } = require('../middleware/csrf');

router.post('/login', controller.login);
router.get('/me', requireAuth, controller.me);
router.post('/logout', requireAuth, requireCsrf, controller.logout);

module.exports = router;
