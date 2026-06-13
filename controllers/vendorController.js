const { InventoryItem, Listing, Claim } = require('../models');

// === INVENTORY ===

exports.getInventory = async (req, res) => {
  try {
    const items = await InventoryItem.findAll({ where: { vendorId: req.user.id } });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addInventoryItem = async (req, res) => {
  try {
    const { title, description, quantity, category, expirationDate } = req.body;
    const item = await InventoryItem.create({
      vendorId: req.user.id,
      title,
      description,
      quantity,
      category,
      expirationDate,
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.update(req.body);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const item = await InventoryItem.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    await item.destroy();
    res.status(200).json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// === LISTINGS ===

exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.findAll({
      where: { vendorId: req.user.id },
      include: [{ model: InventoryItem, as: 'inventoryItem' }]
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addListing = async (req, res) => {
  try {
    const { inventoryItemId, title, description, pickupAddress } = req.body;
    const listing = await Listing.create({
      vendorId: req.user.id,
      inventoryItemId: inventoryItemId || null,
      title,
      description,
      pickupAddress,
      status: 'active'
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    await listing.update(req.body);
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findOne({ where: { id: req.params.id, vendorId: req.user.id } });
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    await listing.destroy();
    res.status(200).json({ message: 'Listing deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// === DASHBOARD & ANALYTICS ===

exports.getDashboardStats = async (req, res) => {
  try {
    const totalInventory = await InventoryItem.count({ where: { vendorId: req.user.id } });
    const activeListings = await Listing.count({ where: { vendorId: req.user.id, status: 'active' } });
    const totalClaims = await Claim.count({
      include: [{
        model: Listing,
        as: 'listing',
        where: { vendorId: req.user.id }
      }]
    });

    res.status(200).json({
      totalInventory,
      activeListings,
      totalClaims
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    // Placeholder for more detailed analytics
    res.status(200).json({
      message: 'Analytics data fetched successfully',
      data: []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
