//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
// const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/blog", function(req, res){
    res.sendFile(__dirname + "/blog.html");
});

app.get("/recipes", function(req, res){
    res.sendFile(__dirname + "/recipes.html");
});

app.listen(3000, function(){
    console.log("Server running on port 3000");
    
});

