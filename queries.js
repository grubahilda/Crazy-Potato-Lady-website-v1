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


const getPostById = (callback, req, _res) => {
    const id = req.params.postid.toLowerCase().replace(/\s/g, "-");
    pool.query('SELECT * FROM blog_posts WHERE id = $1', [id], (error, results) => {
        
        if (error) {
            console.log(error);
            throw error;
        }
        
        callback(results.rows);
         
    })
}


// const getPostById = (callback, postId) => {
//     pool.query('SELECT * FROM blog_posts WHERE id = $1', [postId], (error, results) => {
        
//         if (error) {
//             console.log(error);
//             throw error;
//         }
        
//         callback(results.rows);
//     })
// }




// const getPostById = (req, res) => {
//     const id = req.params.postid.toLowerCase().replace(/\s/g, "-");

//     pool.query('SELECT * FROM blog_posts WHERE id = $1', [id], (error, results) => {
//         if(error) {
//             throw error
//         }
//         return results.rows;
//     })
// }

// const createPost = (req, res) => {
//     const { id, title, body, picture} = req.body

//     pool.query('INSERT INTO blog_posts (id, post_title, post_body, post_picture) VALUES ($1, $2, $3, $4)', [id, title, body, picture], (error, results) => {
//         if(error){
//             throw error
//         }
//         res.status(201).send(`Blog post added with ID: ${result.insertId}`)
//     })
        
// }

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
    // createPost,
    // updatePost,
    // deletePost,
}