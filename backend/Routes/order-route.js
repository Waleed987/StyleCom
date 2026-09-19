const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order-controller');
const auth = require('../utils/auth');
const { requireAdmin } = require('../utils/auth');

// Create order from cart (checkout)
router.post('/checkout', auth, orderController.createOrderFromCart);

// Get user's order history
router.get('/user', auth, orderController.getUserOrders);

// Get all orders (admin)
router.get('/admin/all', auth, requireAdmin, orderController.getAllOrders);

// Get specific order by ID
router.get('/:orderId', auth, orderController.getOrderById);

// Update order status (admin)
router.patch('/:orderId/status', auth, requireAdmin, orderController.updateOrderStatus);

// Update payment status
router.patch('/:orderId/payment', auth, requireAdmin, orderController.updatePaymentStatus);

// Cancel order
router.patch('/:orderId/cancel', auth, orderController.cancelOrder);

module.exports = router;
