const express = require("express");
const configView = require("./config/config");
const app = express();
const port = 3000;
const webRoute = require("./routes/web");
const connectDB = require("./config/db");
const cookieParser = require('cookie-parser');

const cors = require("cors");
require("dotenv").config();
//config template enginre
app.use( cors({
  origin: "http://localhost:5173", // Đúng với frontend
  credentials: true, // Quan trọng!
}));
configView(app);
app.use(cookieParser()); // Sử dụng cookie-parser
app.use(express.json());
app.use("/api", webRoute);
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`app is running on port ${port}`);
    console.log("connect to DB");
  });
});
