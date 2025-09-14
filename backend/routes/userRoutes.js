const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/me', auth.protect, userController.getMe);

// admin route example
router.get('/', auth.protect, auth.restrictTo('admin'), userController.listUsers);

module.exports = router;
