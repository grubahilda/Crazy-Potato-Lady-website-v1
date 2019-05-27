const Pool = require('pg').Pool;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: "crazypotatolady",
    password: "pass",
    port: 5432,
});

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
    const title = req.body.postTitle;
    const body = req.body.postBody;
    const picture = '../images/bird-chicken-chicks-2134246.jpg';

    const tags = req.body.postTags.match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g);
    const id = title.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");

    pool.query('INSERT INTO blog_posts (id, posttitle, postbody, postpicture, tags) VALUES ($1, $2, $3, $4, $5)', [id, title, body, picture, tags], (error, _results) => {
        if (error) {
            throw error
        }
        res.status(201).redirect("/blog");
    })

}

const updatePost = (req, res) => {
    const oldId = req.params.postid.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");

    const title = req.body.postTitle;
    const body = req.body.postBody;
    const picture = '../images/animal-barn-calf-436796.jpg';
    
    const tags = req.body.postTags.match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g);
    const newId = title.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");    

    pool.query('UPDATE blog_posts SET posttitle = $1, postbody = $2, postpicture = $3, tags = $4, id = $5 WHERE id = $6',
        [title, body, picture, tags, newId, oldId], (error, _results) => {
            if (error) {
                throw error
            }
            res.status(200).redirect("/blog/" + newId);
        })
}

const deletePost = (req, res) => {
    const id = req.params.postid.toLowerCase().replace(/\s|\W/g, "-");  
      
    pool.query('DELETE FROM blog_posts WHERE id = $1', [id], (error, results) => {
        if(error) {
            throw error
        }
        res.status(200).redirect("/blog");
    })
}


module.exports = {
    getPosts,
    getPostById,
    getPostsByTag,
    createPost,
    updatePost,
    deletePost
}