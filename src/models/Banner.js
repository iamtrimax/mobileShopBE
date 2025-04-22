const  mongoose  = require("mongoose");

const bannerSchema = mongoose.Schema({
    name: String,
    image: String,
    productId:{
        type: String,
        ref:"products"
    }
},{
    timestamps:true
}) 
const Banner = mongoose.model("banner",bannerSchema)

module.exports = Banner;