const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true
    },
    brandName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sellingPrice: {
        type: Number,
    },
    productImage:[],
    screen:{
        type: String,
        required: true
    },
    camera: {
        type: String,
        required: true
    },
    os: {
        type: String,
        required: true
    },
    RAM: {
        type: String,
        required: true
    },
    ROM: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },

},{
    timestamps: true,
})

const productModel = mongoose.model('products',productSchema)
module.exports = productModel