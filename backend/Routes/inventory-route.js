const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory-controller');
const auth = require('../utils/auth');
const { requireAdmin } = require('../utils/auth');

router.get('/collection/:productName',inventoryController.getItem);
router.post('/collection', auth, requireAdmin, inventoryController.insertItem);
router.delete('/collection/:productName', auth, requireAdmin, inventoryController.deleteItem);
router.get('/collection',inventoryController.getAllItems);

module.exports = router;
