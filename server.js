//jshint esversion:6

require('dotenv').config();

const express = require('express');
const multer = require('multer');
const session = require('express-session');
const bodyParser = require("body-parser");
// const jwt = require("jsonwebtoken");
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
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.post("/logout", (req, res) => {
    req.session.destroy();
    adminLogged = false;
    res.redirect("/");
})


app.get("/", function (req, res) {

    if (!req.session.user) {
        adminLogged = false;
    }

    db.countRecipes(function (count) {
        res.render("index", {
            recipesCount: count
        });
    })



});

app.get("/blog", function (req, res) {
    if (!req.session.user) {
        adminLogged = false;
    }
    try {
        db.getPosts(function (rows) {

            res.render("blog", {
                posts: rows,
                adminLogged: adminLogged
            });
        });
    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
});

app.get("/blog/compose", function (req, res) {
    if (!req.session.user) {
        adminLogged = false
        res.render("forbidden");

    } else {
        res.render("compose");
    }


});

// login route start
app.route("/login")
    .get((req, res) => {

        if (!req.session.user) {
            adminLogged = false;
            res.render("login", {
                error: false,
                message: ''
            });
        } else {
            res.redirect("blog")
        }

    })

    .post(db.verifyAdmin);



// const user = {
//     id: 1,
//     username: 'grubahilda',
//     email: 'martalost@gmail.com',
// }
// jwt.sign({
//     user
// }, 'secretkey', (_error, token) => {
//     res.json({
//         token
//     })
// });
// })
// login route end


app.post("/blog/compose", upload.single('postPictureFile'), db.createPost);

app.get("/blog/:postid", function (req, res) {

    db.getPostById(function (rows) {

        if (req.params.postid.toLowerCase().replace(/\s|\W/g, "-") == rows[0].id) {
            res.render("post", {
                post: rows[0],
                adminLogged: adminLogged
            });
        } else {
            res.sendStatus(404);
        }
    }, req);

});

// postid edit route start
app.route('/blog/:postid/edit')
    .get(function (req, res) {

        if (adminLogged) {
            db.getPostById(function (rows) {


                if (req.params.postid.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-") == rows[0].id) {
                    res.render("edit", {
                        post: rows[0],
                        adminLogged: adminLogged
                    });
                } else {
                    res.sendStatus(404);
                }
            }, req);
        } else {
            res.render("forbidden");
        }

    })

    .post(upload.single('postPictureFileEdit'), db.updatePost);

// postid edit route end

app.post('/blog/:postid', db.deletePost);


app.get("/recipes", function (req, res) {
    if (!req.session.user) {
        adminLogged = false;
    }
    try {

        var breakfasts = [];

        db.getRecipesByCategoryForSection(function (rows) {
                breakfasts = rows;

            }, 'breakfast')
            .then(function (value) {



                db.getRecipesByCategoryForSection(function (rows) {
                        lunches = rows;

                    }, 'lunch')
                    .then(function (value) {

                        db.getRecipesByCategoryForSection(function (rows) {
                                snacks = rows;

                            }, 'snack')
                            .then(function (value) {

                                res.render("recipes", {
                                    breakfasts: breakfasts,
                                    lunches: lunches,
                                    snacks: snacks,
                                    adminLogged: adminLogged
                                });
                            })
                            .catch(function (err) {
                                throw err;
                            });

                    })
                    .catch(function (err) {
                        throw err;
                    });

            })
            .catch(function (err) {
                throw err;
            });


    } catch (err) {
        console.error(err);
        res.send("Error: " + err);
    }
});

app.get("/recipes/breakfasts", (_req, res) => {

    db.getRecipesByCategoryPage(function (rows) {
        res.render("breakfasts", {
            breakfasts: rows,
            adminLogged: false
        });

        }, 'breakfast');

});

app.get("/recipes/snacks", (_req, res) => {

    db.getRecipesByCategoryPage(function (rows) {
        res.render("snacks", {
            snacks: rows,
            adminLogged: false
        });

        }, 'snacks');

});

app.get("/recipes/lunches", (_req, res) => {

    db.getRecipesByCategoryPage(function (rows) {
        res.render("lunches", {
            lunches: rows,
            adminLogged: false
        });

        }, 'lunch');

});


app.get("/recipes/compose", (req, res) => {

    if (!req.session.user) {
        res.render("forbidden", {
            adminLogged: false
        });
    } else {
        res.render("compose-recipes");

    }

});

// app.post("/recipes/compose", upload.single('recipePictureFile'), db.createRecipe);

app.get("/recipes/:recipeid", (req, res) => {
    db.getRecipeByName(function (rows) {
        if (req.params.recipeid.charAt(0).toUpperCase() + req.params.recipeid.slice(1).match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join(" ") == rows[0].title) {
            res.render("recipe", {
                recipe: rows[0],
                adminLogged: adminLogged
            });
        } else {
            res.sendStatus(404);
        }
    }, req);
});

app.post('/recipes/:recipeid', db.deleteRecipe);

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

app.get("/blog/tags/:tag", function (req, res) {
    db.getPostsByTag(function (rows) {

        if (rows[0].tags.includes(req.params.tag.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-"))) {
            res.render("tagged-posts", {
                tag: req.params.tag,
                posts: rows,
                adminLogged: adminLogged
            });
        } else {
            res.sendStatus(404);
        }
    }, req);
});

app.get("/recipes/tags/:tag", function (req, res) {
    db.getRecipesByTag(function (rows) {

        if (rows[0].tags.includes(req.params.tag.toLowerCase())) {
            res.render("tagged-recipes", {
                tag: req.params.tag,
                recipes: rows,
                adminLogged: adminLogged
            });
        } else {
            res.sendStatus(404);
        }
    }, req);
});


// function verifyToken(req, res, next) {
//     // Get auth header value
//     const bearerHeader = req.headers['autorization'];

//     if(typeof bearerHeader != 'undefined') {
//         // Split at the space
//         const bearer = bearerHeader.split(' ');
//         // Get token from array
//         const bearerToken = bearer[1];
//         // Set the token
//         req.token = bearerToken;
//         // Next middleware
//         next();
//     } else {
//         res.sendStatus(403);
//     }
// }



app.listen(process.env.PORT || 5000, function (err, _res) {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Server running on port 3000");
    }


});