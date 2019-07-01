const Pool = require('pg').Pool;
const pool = new Pool({
    // user: 'postgres',
    // host: 'localhost',
    // database: "crazypotatolady",
    // password: "pass",
    // port: 5432,
    user: 'postgres',
    password: "pass",
    connectionString: process.env.DATABASE_URL,
    sslmode: true
});
// let server = require('./server');

// const fs = require('fs');

// CLOUDINARY CONFIGUATION
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: 'crazypotatolady',
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

function getTimeStamp() {
    const today = new Date();
    return today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
}



// QUERIES FOR BLOG POSTS

const getPosts = (callback) => {
    pool.query('SELECT * FROM blog_posts', (error, results) => {

        if (error) {
            console.log(error);
            throw error;
        }

        callback(results.rows);
    })
}

const getPostById = (callback, req) => {
    const id = req.params.postid.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");


    pool.query('SELECT * FROM blog_posts WHERE id = $1', [id], (error, results) => {

        if (error) {
            console.log(error);
            throw error;
        }

        callback(results.rows);
    })
}

const getPostsByTag = (callback, req) => {
    const tag = req.params.tag;

    pool.query('SELECT * FROM blog_posts WHERE $1=ANY(tags);', [tag], (error, results) => {

        if (error) {
            console.log(error);
            throw error;
        }

        callback(results.rows);
    })
}


const createPost = (req, res) => {
    // const title = req.body.postTitle;
    // const body = req.body.postBody;

    cloudinary.v2.uploader.upload(req.body.postTitle, {
            resource_type: "image",
            public_id: req.body.postTitle,
            overwrite: true
            // notification_url: "https://mysite.example.com/notify_endpoint"
        },
        function (error, result) {
            console.log(result, error)
        });

    // const picture = '../images/uploads/' + req.file.filename;

    // const tags = req.body.postTags.match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g);
    // const id = title.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");

    // pool.query('INSERT INTO blog_posts (id, posttitle, postbody, postpicture, tags) VALUES ($1, $2, $3, $4, $5)', [id, title, body, picture, tags], (error, _results) => {
    //     if (error) {
    //         throw error
    //     }
    // });
    // console.log(getTimeStamp() + " || New blog post has been created: " + id);

    // res.status(200).redirect("/blog");
}

const updatePost = (req, res) => {
    if(adminLogged) {
        
        const oldId = req.params.postid.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");

        const title = req.body.postTitle;
        const body = req.body.postBody;
        const tags = req.body.postTags.match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g);
        const newId = title.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");
    
        if (req.body.postPictureFile == '') {
            fs.unlink(__dirname + '\\public\\images\\uploads\\' + oldId + '.jpg', (error) => {
                if (error) {
                    if (error.code != 'ENOENT') {
                        throw error;
                    }
                }
            });
    
            pool.query('UPDATE blog_posts SET posttitle = $1, postbody = $2, tags = $3, id = $4 WHERE id = $5',
                [title, body, tags, newId, oldId], (error, _results) => {
                    if (error) {
                        throw error;
                    }
                })
        } else {
            const picture = '../images/uploads/' + title.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-") + '.jpg';
            pool.query('UPDATE blog_posts SET posttitle = $1, postbody = $2, postpicture = $3, tags = $4, id = $5 WHERE id = $6',
                [title, body, picture, tags, newId, oldId], (error, _results) => {
                    if (error) {
                        throw error;
                    }
                })
            console.log(getTimeStamp() + " || Picture has been added: " + picture);
    
        }
        console.log(getTimeStamp() + " || Blog post has been updated: " + newId);
    
        res.status(200).redirect("/blog/" + newId);


    } else {
        res.render("forbidden");
    }

    
}

const deletePost = (req, res) => {
    const id = req.params.postid.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");

    cloudinary.uploader.destroy(id, function (result) {
        console.log(result)
    });
    // fs.unlink('https://res.cloudinary.com/crazypotatolady/image/upload/' + id + '.jpg', (error) => {        
    //     if (error) {
    //         if (error.code != 'ENOENT') {
    //             throw error;
    //         }
    //     }
    //     console.log(getTimeStamp() + " || Picture has been deleted: " + id + '.jpg');
    // });

    pool.query('DELETE FROM blog_posts WHERE id = $1', [id], (error, _results) => {
        if (error) {
            throw error
        }
    })
    console.log(getTimeStamp() + " || Blog post has been deleted: " + id);

    res.status(200).redirect("/blog");
}



// QUERIES FOR RECIPES SECTION

const getRecipes = (callback) => {
    pool.query('SELECT * FROM recipes', (error, results) => {

        if (error) {
            console.log(error);
            throw error;
        }

        callback(results.rows);
    })
}

const getRecipeByName = (callback, req) => {
    const name = req.params.recipeid.charAt(0).toUpperCase() + req.params.recipeid.slice(1).match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join(" ");
    

    pool.query('SELECT * FROM recipes WHERE title = $1', [name], (error, results) => {

        if (error) {
            console.log(error);
            throw error;
        }
        callback(results.rows);
    })
}


const getRecipesByTag = (callback, req) => {
    const tag = req.params.tag;

    pool.query('SELECT * FROM recipes WHERE $1=ANY(tags);', [tag], (error, results) => {

        if (error) {
            console.log(error);
            throw error;
        }

        callback(results.rows);
    })
}


// const createRecipe = (req, res) => {
//     const title = req.body.recipeTitle;
//     const category = req.body.recipeCategory;
//     const prepTime = req.body.prepTime;
//     const image = req.body.recipePictureFile;
//     const recipeServings = req.body.recipeServings;
//     const field = req.body.field;

//     console.log(field);
    
//     // for()
//     const ingredients = req.body.recipeServings;

//     // cloudinary.v2.uploader.upload(req.body.postTitle, {
//     //         resource_type: "image",
//     //         public_id: req.body.postTitle,
//     //         overwrite: true
//     //         // notification_url: "https://mysite.example.com/notify_endpoint"
//     //     },
//     //     function (error, result) {
//     //         console.log(result, error)
//     //     });

//     // const picture = '../images/uploads/' + req.file.filename;

//     // const tags = req.body.postTags.match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g);

//     // pool.query('INSERT INTO recipes (title, category, preptime, servings, ingredients, methoditems, tags, tips, image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [title, category, prepTime, recipeServings, ingredients, tags, tips, image], (error, _results) => {
//     //     if (error) {
//     //         throw error
//     //     }
//     // });
//     // console.log(getTimeStamp() + " || New recipe has been created: " + id);

//     // res.status(200).redirect("/recipes");
// }


const deleteRecipe = (req, res) => {
    const title = req.params.recipeid.charAt(0).toUpperCase() + req.params.recipeid.slice(1).match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join(" ");

    pool.query('SELECT * FROM recipes WHERE title = $1', [title], (error, results) => {
        if(error) {
            throw error
        }
        const picture = results.row.image;
    })

    cloudinary.uploader.destroy(id, function (result) {
        console.log(result)
    });
    fs.unlink(image, (error) => {        
        if (error) {
            if (error.code != 'ENOENT') {
                throw error;
            }
        }
        console.log(getTimeStamp() + " || Picture has been deleted: " + title);
    });

    pool.query('DELETE FROM recipes WHERE title = $1', [title], (error, _results) => {
        if (error) {
            throw error
        }
    })
    console.log(getTimeStamp() + " || Recipe has been deleted: " + title);

    res.status(200).redirect("/recipes");
}




const verifyAdmin = (req, res) => {
    const email = req.body.useremail;
    const password = req.body.password;

    pool.query("SELECT * FROM users WHERE email=$1", [email], (error, results) => {
        if (error) {
            throw error
        } else {
            if (results.rows.length == 0) {
                res.render("login", {
                    error: true,
                    message: 'Wrong username or the user doesn\'t exist'
                })
            }
            else if (results.rows != "undefined" || results.rows != []) {

                if (results.rows[0].userpassword === password) {
                    adminLogged = true;
                    req.session.user = results.rows;                    
                    
                    res.redirect("/blog");
                } else {
                    res.render("login", {
                        error: true,
                        message: 'Wrong password'
                    })
                }
            }

        }
    })
}


module.exports = {
    getPosts,
    getPostById,
    getPostsByTag,
    createPost,
    updatePost,
    deletePost,
    getRecipes,
    getRecipeByName,
    getRecipesByTag,
    // createRecipe,
    // updateRecipe,
    deleteRecipe,
    verifyAdmin
}