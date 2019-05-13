//jshint esversion:6

const express = require('express');
const bodyParser = require("body-parser");
// const ejs = require("ejs");

//BLOG TEMPORARY CONTENTS

const blogPreviewText = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolore dolorem, recusandae est eligendi tempore fugiat sint ex ab repudiandae exercitationem assumenda maxime earum nisi dignissimos eum perspiciatis unde aperiam tempora itaque et blanditiis quod placeat? Vel aliquid ab eveniet laboriosam consectetur molestias doloremque ipsum tenetur. Provident assumenda dolorem fugiat atque, ullam magnam quidem reprehenderit. Exercitationem officiis expedita rerum architecto dolorem explicabo atque iusto debitis quis officia id eligendi excepturi omnis, facere perspiciatis nobis facilis. Illum esse placeat ut, dicta eos quod mollitia ipsam animi. Rem impedit, ipsa expedita quaerat ipsum perspiciatis quo dignissimos, earum suscipit et blanditiis beatae? Similique, cumque?\xa0\xa0\xa0\xa0";

const title1 = "How to cook beans";
const title2 = "Less waste tips";
const title3 = "Living with non-vegans";



const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.render("index");
});


app.get("/blog", function (req, res) {
    res.render("blog", {
        blogPreviewText: blogPreviewText,
        title1: title1,
        title2: title2,
        title3: title3
    });
});

app.get("/recipes", function (req, res) {
    res.render("recipes");
});

app.get("/about", function (req, res) {
    res.render("about");
});

app.get("/contact", function (req, res) {
    res.render("contact");
});

app.get("/cooperation", function (req, res) {
    res.render("cooperation");
});

app.get("/share", function (req, res) {
    res.render("share");
});

app.listen(3000, function () {
    console.log("Server running on port 3000");

});