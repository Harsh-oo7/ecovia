
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Bags = new Schema({
    uuid: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    area: {
        type: String,
        enum: {
            values: ['DAMAGED', 'REPAIR', "READY"],
            message: '{VALUE} is not supported'
        },
        default: "DAMAGED"
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stores"
    },
}, { timestamps: true });

module.exports = mongoose.model('Bags', Bags);