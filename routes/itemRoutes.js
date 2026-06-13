const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public routes
router.get('/', itemController.getItems);
router.get('/:id', itemController.getItemById);

// Protected routes (Only users can claim items)
router.post('/:id/claim', protect, restrictTo('user'), itemController.claimItem);

module.exports = router;
