const mongoose = require('mongoose');
const Cart = require('./Cart'); // assuming Cart model is in the same directory

const orderSchema = new mongoose.Schema({
    //orderId: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Method to get order details
orderSchema.methods.getOrderDetails = function(orderId) {
    // Logic to return order details
    return this;
};

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = Order;