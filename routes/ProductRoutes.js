const express = require('express');
const Product = require('../models/product'); // Assuming you have a Product model
const auth = require('../authMiddleware'); // Import the custom auth middleware
const router = express.Router();

// Create a new product (Admin only)
router.post('/', auth(['admin']), async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create product' });
    }
});

// Get all products (Available for both users and admins)
router.get('/',  async (req, res) => {
    try {
        const products = await Product.find({});
        res.send(products);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch products' });
    }
});

// Get a product by ID (Available for both users and admins)
router.get('/:id',  async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        res.send(product);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch product' });
    }
});

// Update a product (Admin only)
router.patch('/:id', auth(['admin']), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'price', 'description', 'imageURL'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        updates.forEach(update => (product[update] = req.body[update]));
        await product.save();
        res.send(product);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update product' });
    }
});

// Delete a product (Admin only)
router.delete('/:id', auth(['admin']), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.send({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete product' });
    }
});

module.exports = router;