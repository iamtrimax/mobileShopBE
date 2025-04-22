const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    email:{
        type: String,
        unique: true,
        require: true
    },
    password: String,
    role: String,
},{
    timestamps: true,
})

const userModel = mongoose.model('users',userSchema)
module.exports = userModel