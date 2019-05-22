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
    const id = req.params.postid.toLowerCase().replace(/\s/g, "-");

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


const createPost = (req, _res) => {
    const title = req.body.postTitle;
    const body = req.body.postBody;
    const picture = '../images/bird-chicken-chicks-2134246.jpg';

    

    // let tags = req.body.postTags.match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g); 
    // const id = title.toLowerCase().match(/[A-Za-z\u00C0-\u00FF\u0100-\u017F]+/g).join("-");
    // console.log(id, title, body, picture, tags);
    console.log(title, body, picture, req.body.postTags);

    // pool.query('INSERT INTO blog_posts (id, posttitle, postbody, postpicture, tags) VALUES ($1, $2, $3, $4)', [id, title, body, picture, tags], (error, results) => {
    //     if (error) {
    //         throw error
    //     }
    //     res.status(201).redirect("/blog");
    // })

}

// const updatePost = (req, res) => {
//     const id = req.params.postid
//     const {title, body, picture, id} = req.body

//     pool.query('UPDATE blog_posts SET post_title = $1, post_body = $2, post_picture = $3, id = $4',
//     [title, body, picture, id], (error, results) => {
//         if(error) {
//             throw error
//         }
//         res.status(200).send(`Blog post modified with ID: ${id}`)
//     })
// }

// const deletePost = (req, res) => {
//     const id = req.params.postid

//     pool.query('DELETE FROM blog_posts WHERE id = $1', [id], (error, results) => {
//         if(error) {
//             throw error
//         }
//         res.status(200).send(`Blog post deleted with ID: ${id}`)
//     })
// }


module.exports = {
    getPosts,
    getPostById,
    getPostsByTag,
    createPost,
    // updatePost,
    // deletePost,
}