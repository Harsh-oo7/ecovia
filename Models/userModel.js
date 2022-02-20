

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Users = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        minLength: [6, "Your password must have at least 6 characters"],
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Users', Users);