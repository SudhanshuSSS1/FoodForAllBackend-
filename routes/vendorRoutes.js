const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protect all routes and restrict to vendors
router.use(protect);
router.use(restrictTo('vendor'));

// Dashboard & Analytics
router.get('/dashboard/stats', vendorController.getDashboardStats);
router.get('/analytics', vendorController.getAnalytics);

// Inventory
router.get('/inventory', vendorController.getInventory);
router.post('/inventory', vendorController.addInventoryItem);
router.put('/inventory/:id', vendorController.updateInventoryItem);
router.delete('/inventory/:id', vendorController.deleteInventoryItem);

// Listings
router.get('/listings', vendorController.getListings);
router.post('/listings', vendorController.addListing);
router.put('/listings/:id', vendorController.updateListing);
router.delete('/listings/:id', vendorController.deleteListing);

module.exports = router;
