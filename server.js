//jshint esversion:6

const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const db = require('./queries')

const {
    Pool
} = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});


// MULTER CONFIGURATION
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'upload/')
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname;

        var extension = originalname.split(".");
        filename = req.body.postTitle.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-") + '.' + extension[extension.length - 1];
        cb(null, filename);
    }
});
var upload = multer({
    storage: storage
});




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
    try {
        db.getPosts(function (rows) {

            res.render("blog", {
                posts: rows
            });
        });
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
});

app.get("/blog/compose", verifyToken, function (_req, res) {
    jwt.verify(req.token, 'secretkey', (error, authData) => {
        if(error) {
            res.sendStatus(403);
        } else {
            res.render("compose");
        }
    })
    
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", (req, res) => {

    const user = {
        id: 1,
        username: 'grubahilda',
        email: 'martalost@gmail.com',
    }
    jwt.sign({
        user
    }, 'secretkey', (_error, token) => {
        res.json({
            token
        })
    });
})

app.post("/blog/compose", verifyToken, upload.single('postPictureFile'), db.createPost);

app.get("/blog/:postid", function (req, res) {

    db.getPostById(function (rows) {

        if (req.params.postid.toLowerCase().replace(/\s|\W/g, "-") == rows[0].id) {
            res.render("post", {
                post: rows[0]
            });
        } else {
            res.sendStatus(404);
        }
    }, req);

});

app.get('/blog/:postid/edit', verifyToken, function (req, res) {

    db.getPostById(function (rows) {


        if (req.params.postid.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-") == rows[0].id) {
            res.render("edit", {
                post: rows[0]
            });
        } else {
            res.sendStatus(404);
        }
    }, req);

});

app.post('/blog/:postid/edit', verifyToken, upload.single('postPictureFileEdit'), db.updatePost);

app.post('/blog/:postid', db.deletePost);


app.get("/recipes", function (_req, res) {
    res.render("recipes");
});

app.get("/recipes/compose", verifyToken, (req, res) => {
    res.render("compose-recipes");
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
    db.getPostsByTag(function (rows) {

        if (rows[0].tags.includes(req.params.tag.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-"))) {
            res.render("tagged-posts", {
                tag: req.params.tag,
                posts: rows
            });
        } else {
            res.sendStatus(404);
        }
    }, req);
});


function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['autorization'];

    if(typeof bearerHeader != 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        res.sendStatus(403);
    }
}



app.listen(process.env.PORT || 5000, function (err, _res) {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Server running on port 3000");
    }


});