const mongoose = require('mongoose');
const Product = require('./Product'); // assuming Product model is in the same directory

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
});

// Method to calculate the subtotal
cartItemSchema.methods.getSubtotal = function() {
    return this.product.price * this.quantity;
};

const CartItem = mongoose.models.CartItem ||mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;