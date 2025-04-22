const express = require("express");

const configView  = (app) => {
    app.set("./src/views", "./views" );
    app.set("view engine", "ejs");
    
    app.use(express.static("public"));
}
module.exports = configView;