//jshint esversion:6

const express = require('express');
const multer = require('multer');
const bodyParser = require("body-parser");
const db = require('./queries')
// const ejs = require("ejs");

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, __dirname + '\\public\\images\\uploads\\')
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname;
        
      var extension = originalname.split(".");
      filename = req.body.postTitle.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-") + '.' + extension[extension.length-1];
      cb(null, filename);      
    }
  });
  var upload = multer({ storage: storage });

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

app.get("/", function (_req, res) {
    res.render("index");
});

app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error: " + err);
    }
  });


app.get("/blog", function (_req, res) {
    db.getPosts(function (rows) {

        res.render("blog", {
            posts: rows
        });
    });


});

app.get("/blog/compose", function (_req, res) {
    res.render("compose");
});

app.post("/blog/compose", upload.single('postPictureFile'), db.createPost); 

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

app.get('/blog/:postid/edit', function(req, res){

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

app.post('/blog/:postid/edit', upload.single('postPictureFileEdit'), db.updatePost);

app.post('/blog/:postid', db.deletePost);


app.get("/recipes", function (_req, res) {
    res.render("recipes");
});

app.get("/recipes/compose", (req, res) => {
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
    db.getPostsByTag(function(rows){
        
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



app.listen(process.env.PORT || 5000, function (err, _res) {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Server running on port 3000");
    }


});