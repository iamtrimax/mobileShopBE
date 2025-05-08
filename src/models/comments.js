const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required:true
    },
    productId:{
        type: mongoose.Types.ObjectId,
        ref:"products",
        required:true
    },
    parentId:{
        type: mongoose.Types.ObjectId,
        ref:"comment",
        default:null
    },
    userId:{
        type: mongoose.Types.ObjectId,
        ref:"users",
        required:true
    }
},{
    timestamps: true,
})

const comment = mongoose.model("comment", commentSchema)

module.exports = comment