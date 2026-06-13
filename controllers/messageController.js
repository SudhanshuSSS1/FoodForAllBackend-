const { Conversation, Message, User, Listing } = require('../models');
const { Op } = require('sequelize');

exports.getConversations = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ user1Id: userId }, { user2Id: userId }]
      },
      include: [
        { model: User, as: 'user1', attributes: ['id', 'fullName', 'role', 'shopName'] },
        { model: User, as: 'user2', attributes: ['id', 'fullName', 'role', 'shopName'] },
        { model: Listing, as: 'listing', attributes: ['id', 'title'] }
      ],
      order: [['updatedAt', 'DESC']]
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify user is part of the conversation
    const conversation = await Conversation.findByPk(conversationId);
    if (!conversation) return res.status(404).json({ message: 'Conversation not found' });
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }

    const messages = await Message.findAll({
      where: { conversationId },
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, receiverId, listingId } = req.body;
    const senderId = req.user.id;

    let convId = conversationId;

    // If starting a new conversation
    if (!convId || convId === 'new') {
      if (!receiverId) return res.status(400).json({ message: 'receiverId is required for a new conversation' });
      
      // Check if conversation already exists
      let conv = await Conversation.findOne({
        where: {
          [Op.or]: [
            { user1Id: senderId, user2Id: receiverId },
            { user1Id: receiverId, user2Id: senderId }
          ],
          listingId: listingId || null
        }
      });

      if (!conv) {
        conv = await Conversation.create({
          user1Id: senderId,
          user2Id: receiverId,
          listingId: listingId || null
        });
      }
      convId = conv.id;
    }

    const message = await Message.create({
      conversationId: convId,
      senderId,
      content
    });

    // Update conversation updatedAt
    await Conversation.update({ updatedAt: new Date() }, { where: { id: convId } });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
