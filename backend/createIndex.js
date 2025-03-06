const fs = require("fs").promises;
const { readData, writeData } = require('./readWrite')

const postsFilePath = "./data/post_data.json";
const usersFilePath = "./data/user_data.json";
const postsTitleIndexPath = "./data/posts_title_index.json";
const postsAuthorIndexPath = "./data/posts_author_index.json";
const usersEmailIndexPath = "./data/users_email_index.json";

// Build title index for posts
async function buildPostsTitleIndex() {
    const posts = await readData(postsFilePath);
    const titleIndex = {};

    posts.forEach((post, index) => {
        if (post.title) {
            titleIndex[post.title] = index + 1; // Map title to index in posts array
        }
    });

    await writeData(postsTitleIndexPath, titleIndex);
    console.log("posts_title_index.json created successfully");
}

// Build author index for posts
async function buildPostsAuthorIndex() {
    const posts = await readData(postsFilePath);
    const authorIndex = {};

    posts.forEach((post, index) => {
        if (post.authorId) {
            if (!authorIndex[post.authorId]) {
                authorIndex[post.authorId] = [];
            }
            authorIndex[post.authorId].push(index + 1); // Map authorId to list of post indexes
        }
    });

    await writeData(postsAuthorIndexPath, authorIndex);
    console.log("posts_author_index.json created successfully");
}

// Build email index for users
async function buildUsersEmailIndex() {
    const users = await readData(usersFilePath);
    const emailIndex = {};

    users.forEach((user, index) => {
        if (user.email) {
            emailIndex[user.email] = index + 1; // Map email to index in users array
        }
    });

    await writeData(usersEmailIndexPath, emailIndex);
    console.log("users_email_index.json created successfully");
}

// Run all index builders
async function buildAllIndexes() {
    await buildPostsTitleIndex();
    await buildPostsAuthorIndex();
    await buildUsersEmailIndex();
    console.log("All index files created successfully");
}

buildAllIndexes();



// // Read and parse JSON data from a file
// async function readData(filePath) {
//     const data = await fs.readFile(filePath, "utf8");
//     return JSON.parse(data);
// }

// // Write JSON data to a file
// async function writeData(filePath, data) {
//     await fs.writeFile(filePath, JSON.stringify(data, null, 2));
// }