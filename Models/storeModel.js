


const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Stores = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
}, { timestamps: true });

module.exports = mongoose.model('Stores', Stores);