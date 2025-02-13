const mongoose = require('mongoose');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        
    },
    age: {
        type: Number,
        required: true
    }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);