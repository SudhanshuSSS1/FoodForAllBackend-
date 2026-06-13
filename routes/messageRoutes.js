const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All message routes require authentication
router.use(protect);

router.get('/', messageController.getConversations);
router.get('/:conversationId', messageController.getMessages);
router.post('/:conversationId', messageController.sendMessage);

module.exports = router;
