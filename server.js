//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
const db = require('./queries')
// const ejs = require("ejs");

//BLOG TEMPORARY CONTENTS

const blogPreviewText = "<div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore dolorem, recusandae est eligendi tempore fugiat sint ex ab repudiandae exercitationem assumenda maxime earum nisi dignissimos eum perspiciatis unde aperiam tempora itaque et blanditiis quod placeat? Vel aliquid ab eveniet laboriosam consectetur molestias doloremque ipsum tenetur.</div>\nProvident assumenda dolorem fugiat atque, ullam magnam quidem reprehenderit. Exercitationem officiis expedita rerum architecto dolorem explicabo atque iusto debitis quis officia id eligendi excepturi omnis, facere perspiciatis nobis facilis. Illum esse placeat ut, dicta eos quod mollitia ipsam animi. Rem impedit, ipsa expedita quaerat ipsum perspiciatis quo dignissimos, earum suscipit et blanditiis beatae? Similique, cumque?";

const title1 = "How to cook beans";
const title2 = "Less waste tips";
const title3 = "Living with non-vegans";

let posts = [{postTitle: title1, postBody: blogPreviewText, postPicture: '../images/bean-black-rice-cereal-1537169.jpg'}, {postTitle: title2, postBody: blogPreviewText, postPicture: '../images/apple-3040132_1920.jpg'}, {postTitle: title3, postBody: blogPreviewText, postPicture: '../images/adult-asian-caucasian-1153213.jpg'}];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

let whatever;

app.get("/", function (_req, res) {
    res.render("index");
});


app.get("/blog", db.getPosts);
// app.get("/blog", db.getPosts, function (req, res) {
//     // const posts = await db.getPosts;
//     // db.getPosts
//     // console.log(posts);
//     // const json = [{"id":1,"title"":hello world!","author":"me"}];

//     // res.render("blog", { posts: posts });
// });

app.get("/blog/:postid", function(req, res){
    posts.forEach(function(post){
        // console.log("yes------------------------------------------------------------------------------------------");
        
        if(req.params.postid.toLowerCase().replace(/-/g , " ") === post.postTitle.toLowerCase().replace(/[^a-zA-Z\s]+/g, ' ')) {
            res.render("post", {post: post});
        }
    });

    
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

app.get("/compose", function (_req, res) {
    res.render("compose");
});

app.post("/compose", function(req, res){
    const post = {
        postTitle: req.body.postTitle,
        postBody: req.body.postBody
    }
    posts.push(post);
    res.redirect("/blog");
    console.log(posts);
});

app.listen(3000, function () {
    console.log("Server running on port 3000");

});

