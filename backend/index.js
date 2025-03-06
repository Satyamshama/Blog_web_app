const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises;
const { readData, writeData } = require('./readWrite')
// const { binarySearchByEmail, getPostsByTitlePrefix } = require('./search')
const Trie = require('./trie')
const BTree = require('./b-tree')

const app = express();
const PORT = 3000;

// Define file paths for posts and users
const postsFilePath = "./data/post_data.json";
const usersFilePath = "./data/user_data.json";


// Middleware
app.use(express.static(path.join(__dirname + "/../frontend")));
app.use(cors());
app.use(express.json());


app.listen(PORT, console.log(`Server started at port ${PORT}`))

// Routes
app.get("/", (req, res) => {
    console.log(__dirname)
    // res.sendStatus(200)
    res.sendFile(path.join(__dirname + "/../frontend/index.html"))
})

app.get("/api/recent-posts", async (req, res) => {
    try {
        const posts = await readData(postsFilePath);
        // const recentPosts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        const recentPosts = posts.slice(100, 105);
        res.json(recentPosts);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recent posts" });
    }
});



app.get("/api/posts/:id", async (req, res) => {
    const postId = parseInt(req.params.id);
    const posts = await readData(postsFilePath);
    const post = posts.find(post => post.postId === postId);

    if (!post) {
        return res.status(404).json({ message: "Post Not Found" });
    }

    res.status(200).json([post]);
});

app.get("/api/details", async (req, res) => {
    const posts = await readData(postsFilePath);
    const users = await readData(usersFilePath);

    // Select a range of posts
    const sendPosts = posts.slice(100, 105);

    // Populate author details for each post
    const postsWithAuthors = sendPosts.map(post => {
        const author = users.find(user => user.userId === post.authorId);
        return {
            ...post,
            author: { username: author ? author.username : "Unknown" }
        };
    });

    res.json({ posts: postsWithAuthors });
});


app.post("/api/create", async (req, res) => {
    const { title, content, username, email } = req.body;
    const users = await readData(usersFilePath);
    const posts = await readData(postsFilePath);

    let user = users.find(user => user.email === email);

    if (!user) {
        // Create new user and add to users.json
        user = { userId: users.length + 1, username, email };
        users.push(user);
        await writeData(usersFilePath, users);
    }

    // Create new post and add to posts.json
    const newPost = {
        postId: posts.length + 1,
        title,
        content,
        authorId: user.userId
    };
    posts.push(newPost);
    await writeData(postsFilePath, posts);

    res.json({ success: true, message: "User and post created successfully." });
});




app.get("/api/posts/title/:title", async (req, res) => {
    const title = req.params.title;
    const posts = await readData(postsFilePath);
    const post = posts.find(post => post.title === title);

    if (!post) {
        return res.status(404).json({ message: "Post Not Found" });
    }

    res.json(post);
});


app.get("/api/posts/author/:email", async (req, res) => {
    const email = req.params.email;
    const users = await readData(usersFilePath);
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({ message: "Author Not Found" });
    }

    const posts = await readData(postsFilePath);
    const authorPosts = posts.filter(post => post.authorId === user.userId);

    res.json(authorPosts);
});


/** Error Reason:
 The issue here is that await User.findOne({ email: email })._id is attempting to access the _id property directly on the result of findOne, but if no user is found, findOne will return null, causing undefined when accessing _id. This is why you’re seeing undefined for the id and an empty array for posts.
 */
// app.get("/api/posts/author/:email", async (req, res) => {
//     const email = req.params.email

//     const id = await User.findOne({ email: email })._id
//     console.log(id)
//     const posts = await Post.find({ authorId: id})
//     console.log(posts)
//     return res.status(200).send(posts)    
// })







// app.get("/api/details", async (req, res) => {
//     const posts = await readData(postsFilePath);
//     const users = await readData(usersFilePath);

//     const sendPosts = posts.slice(100, 105)
//     const user = users.find(user => user.userId === 51)
//     return {sendPosts, user}
//     // res.json(sendPosts);
//     // res.json(postsWithAuthors)
// });


// app.post("/api/create", async (req, res) => {
//     const {title, content, username, email} = req.body

//     const existingUser = await User.findOne({ email: email })
//     if (existingUser) {
//         //return res.json({ success: false, message: "Email already exists." });

//         // Create corresponding post
//         const newPost = new Post({
//         title: title,
//         content: content,
//         authorId: existingUser._id,
//         });

//         await newPost.save();
//         return res.json({ success: true, message: "New post created successfully for existing user." });
//     }
//     else {
//         // Create new user document
//         const newUser = new User({ username: username, email: email });
//         await newUser.save();

//         // Create corresponding post
//         const newPost = new Post({
//         title: title,
//         content: content,
//         authorId: newUser._id,
//         });
        
//         await newPost.save();
//         return res.json({ success: true, message: "User and post created successfully." });
//     }
// })