const mongoose = require("mongoose");
mongoose.set("strictQuery", true)

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.URL_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("connect to db");
        
    } catch (error) {
        console.log(error);
        
    }
}


module.exports = connectDB