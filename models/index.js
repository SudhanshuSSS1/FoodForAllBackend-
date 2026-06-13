const sequelize = require('../config/database');
const User = require('./User');
const InventoryItem = require('./InventoryItem');
const Listing = require('./Listing');
const Claim = require('./Claim');
const Conversation = require('./Conversation');
const Message = require('./Message');

// User Associations
User.hasMany(InventoryItem, { foreignKey: 'vendorId' });
InventoryItem.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });

User.hasMany(Listing, { foreignKey: 'vendorId' });
Listing.belongsTo(User, { foreignKey: 'vendorId', as: 'vendor' });

User.hasMany(Claim, { foreignKey: 'userId' });
Claim.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Conversation, { foreignKey: 'user1Id' });
User.hasMany(Conversation, { foreignKey: 'user2Id' });
Conversation.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
Conversation.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

User.hasMany(Message, { foreignKey: 'senderId' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

// Inventory & Listing Associations
InventoryItem.hasMany(Listing, { foreignKey: 'inventoryItemId' });
Listing.belongsTo(InventoryItem, { foreignKey: 'inventoryItemId', as: 'inventoryItem' });

// Listing & Claim Associations
Listing.hasMany(Claim, { foreignKey: 'listingId' });
Claim.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

// Conversation & Message Associations
Conversation.hasMany(Message, { foreignKey: 'conversationId' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

// Optional: Context for Conversation
Listing.hasMany(Conversation, { foreignKey: 'listingId' });
Conversation.belongsTo(Listing, { foreignKey: 'listingId', as: 'listing' });

module.exports = {
  sequelize,
  User,
  InventoryItem,
  Listing,
  Claim,
  Conversation,
  Message
};
