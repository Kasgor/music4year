const express = require('express');
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Product = require('../models/product');
const router = express.Router();

// Add item to cart
router.post('/:userId/items', async (req, res) => {
    try {
        const product = await Product.findById(req.body._id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        const cartItem = new CartItem({
            product: product._id,
            quantity: req.body.quantity || 1
        });

        await cartItem.save();

        let cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            cart = new Cart({ userId: req.params.userId, items: [] });
        }

        cart.addItem(cartItem);
        await cart.save();

        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Failed to add item to cart' });
    }
});


router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items');
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }
        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve cart' });
    }
});

router.delete('/:userId/items/:productId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        cart.removeItem(req.params.productId);
        await cart.save();

        res.status(200).send(cart);
    } catch (error) {
        res.status(500).send({ error: 'Failed to remove item from cart' });
    }
});

module.exports = router;