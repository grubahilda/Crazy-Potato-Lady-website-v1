//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const db = require('./queries')
// const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (_req, res) {
    res.render("index");
});


app.get("/blog", function (_req, res) {
    db.getPosts(function (rows) {

        res.render("blog", {
            posts: rows
        });
    });


});

app.get("/blog/:postid", function (req, res) {

    db.getPostById(function (rows) {
        
        if (req.params.postid.toLowerCase().replace(/\s/g, "-") == rows[0].id) {
            res.render("post", {
                post: rows[0]
            });
        } else {
            res.sendStatus(404);
        }
    }, req);

});


app.get("/recipes", function (_req, res) {
    res.render("recipes");
});

app.get("/about", function (_req, res) {
    res.render("about");
});

app.get("/contact", function (_req, res) {
    res.render("contact");
});

app.get("/cooperation", function (_req, res) {
    res.render("cooperation");
});

app.get("/share", function (_req, res) {
    res.render("share");
});

app.get("/tags/:tag", function (req, res) {
    db.getPostsByTag(function(rows){
        console.log(rows);
        
        if (rows[0].tags.includes(req.params.tag.toLowerCase().replace(/\s/g, "-"))) {
            res.render("tagged-posts", {
                tag: req.params.tag,
                posts: rows
            });
        } else {
            res.sendStatus(404);
        }
    }, req);
});

app.get("/compose", function (_req, res) {
    res.render("compose");
});

app.post("/compose", function (req, res) {
    console.log(req.body);
    console.log(req.body.postTitle);
    
    // createPost(req, res);  
    // app.post("/compose", db.createPost); 
});

app.listen(3000, function (err, _res) {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Server running on port 3000");
    }


});