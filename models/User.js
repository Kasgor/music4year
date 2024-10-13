const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    //id: { type: Number, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'], default: 'user' },
});

// Method to get user info
userSchema.methods.getUserInfo = function() {
    return {
        //id: this.id,
        username: this.username,
        email: this.email,
        role: this.role
    };
};
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User =  mongoose.model('User', userSchema);

module.exports = User;