const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    //id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    imageURL: { type: String }
});

// Methods to get product details
productSchema.methods.getPrice = function() {
    return this.price;
};

productSchema.methods.getDescription = function() {
    return this.description;
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

module.exports = Product;