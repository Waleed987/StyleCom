const Order = require('../models/order');
const Cart = require('../models/cart');
const Inventory = require('../models/inventory');

// Create order from cart (checkout process)
const createOrderFromCart = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const userId = req.user.userId;

        // Get user's cart
        const userCart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!userCart || userCart.items.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Cart is empty or doesn't exist" 
            });
        }

        // Validate inventory availability
        for (let item of userCart.items) {
            const product = await Inventory.findById(item.productId);
            if (!product) {
                return res.status(400).json({
                    success: false,
                    message: `Product ${item.productId} not found`
                });
            }
            if (product.availability !== 'available') {
                return res.status(400).json({
                    success: false,
                    message: `Product ${product.productName} is not available`
                });
            }
        }

        // Create order items from cart
        const orderItems = userCart.items.map(item => ({
            productId: item.productId._id,
            quantity: item.quantity,
            price: item.price
        }));

        // Create new order
        const newOrder = new Order({
            userId,
            items: orderItems,
            totalAmount: userCart.totalPrice,
            shippingAddress,
            paymentMethod,
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        const savedOrder = await newOrder.save();

        // Clear the cart after successful order creation
        await Cart.findOneAndUpdate(
            { userId },
            { items: [], totalPrice: 0 },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            order: savedOrder
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: "Error creating order",
            error: error.message
        });
    }
};

// Get user's order history
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const orders = await Order.find({ userId })
            .populate('items.productId', 'productName imageUrl price')
            .sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            orders: orders
        });

    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

// Get all orders (admin function)
const getAllOrders = async (req, res) => {
    try {
        // Note: Admin check removed since auth middleware is removed

        const orders = await Order.find({})
            .populate('items.productId', 'productName imageUrl price')
            .populate('userId', 'name email')
            .sort({ orderDate: -1 });

        res.status(200).json({
            success: true,
            orders: orders
        });

    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching orders",
            error: error.message
        });
    }
};

// Get specific order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId)
            .populate('items.productId', 'productName imageUrl price')
            .populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (!req.user.isAdmin && order.userId._id.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: "You cannot view this order" });
        }

        res.status(200).json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching order",
            error: error.message
        });
    }
};

// Update order status (admin function)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, estimatedDelivery } = req.body;

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Update order status
        if (status) {
            order.status = status;
        }
        
        if (estimatedDelivery) {
            order.estimatedDelivery = estimatedDelivery;
        }

        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message
        });
    }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;

        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.paymentStatus = paymentStatus;
        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error updating payment status:', error);
        res.status(500).json({
            success: false,
            message: "Error updating payment status",
            error: error.message
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (!req.user.isAdmin && order.userId.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: "You cannot cancel this order" });
        }

        // Only allow cancellation of pending orders
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel order that is not pending"
            });
        }

        order.status = 'cancelled';
        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: "Error cancelling order",
            error: error.message
        });
    }
};

module.exports = {
    createOrderFromCart,
    getUserOrders,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
};
