const { Listing, User, InventoryItem, Claim } = require('../models');
const { Op } = require('sequelize');

exports.getItems = async (req, res) => {
  try {
    const { search } = req.query;
    let whereCondition = { status: 'active' };

    if (search) {
      whereCondition.title = { [Op.iLike]: `%${search}%` };
    }

    const items = await Listing.findAll({
      where: whereCondition,
      include: [
        { model: User, as: 'vendor', attributes: ['id', 'shopName', 'address'] },
        { model: InventoryItem, as: 'inventoryItem', attributes: ['category', 'expirationDate'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Listing.findByPk(req.params.id, {
      include: [
        { model: User, as: 'vendor', attributes: ['id', 'shopName', 'address', 'phoneNumber'] },
        { model: InventoryItem, as: 'inventoryItem' }
      ]
    });

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.claimItem = async (req, res) => {
  try {
    const listingId = req.params.id;
    const userId = req.user.id;

    // Check if listing is active
    const listing = await Listing.findByPk(listingId);
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    if (listing.status !== 'active') return res.status(400).json({ message: 'Listing is no longer active' });

    // Check if user already claimed this
    const existingClaim = await Claim.findOne({ where: { listingId, userId } });
    if (existingClaim) return res.status(400).json({ message: 'You have already claimed this item' });

    const claim = await Claim.create({
      listingId,
      userId,
      status: 'pending'
    });

    // Optionally update listing status to claimed
    await listing.update({ status: 'claimed' });

    res.status(201).json({ message: 'Item claimed successfully', claim });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
