const mongoose = require('mongoose');
const User = require('./User'); // assuming User model is in the same directory

const adminSchema = new mongoose.Schema({
    // Inherits from User
});

// Admin methods
adminSchema.methods.manageUsers = function(users) {
    // Logic to manage users
    return users;
};

adminSchema.methods.manageProducts = function(products) {
    // Logic to manage products
    return products;
};

const Admin = User.discriminator('Admin', adminSchema);

module.exports = Admin;