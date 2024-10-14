
const express = require("express");
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const Product = require('../models/product');
const Order = require('../models/order');
const router = express.Router();

router.post('/order/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId })
            .populate({
                path: 'items',
                populate: {
                    path: 'product',
                    model: 'Product'
                }
            });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }
        console.log(cart);

        const order = new Order({
            userId: req.params.userId,
            cart: cart._id,
            status:"completed"

        });

        await order.save();

        res.status(201).send(order);
    } catch (error) {
        res.status(500).send({ error: 'Failed to create order' });
    }
});

router.get('/order/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate({
            path: 'cart',
            populate: {
                path: 'items',
                populate: { path: 'product',
                    model: 'Product'}
            }
        });

        if (!order) {
            return res.status(404).send({ error: 'Order not found' });
        }

        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch order details' });
    }
});

module.exports = router;