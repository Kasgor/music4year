const mongoose = require('mongoose');
const CartItem = require('./CartItem'); // assuming CartItem model is in the same directory

const cartSchema = new mongoose.Schema({
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Add and remove items in the cart
cartSchema.methods.addItem = function(item) {
    this.items.push(item);
};

cartSchema.methods.removeItem = async function(productId) {
    await this.populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product'
        }
    });
    //console.log(this.items.filter(item => item.product._id.toString() !== productId));
    this.items = this.items.filter(item => item.product._id.toString() !== productId);
    await this.save();
};

//not tested
cartSchema.methods.getTotal = async function() {
    await this.populate({
        path: 'items',
        populate: {
            path: 'product',
            model: 'Product'
        }
    });
    return this.items.reduce((total, item) => total + item.getSubtotal(), 0);
};

const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

module.exports = Cart;