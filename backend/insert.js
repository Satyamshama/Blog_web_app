// Insert User
const fs = require('fs');
const {loadUserData, loadPostData, loadAuthorIndexData} = require('./readData')

// Function to save user data
function saveUserData(users, userDataPath) {
    const jsonData = JSON.stringify(users, null, 2);
    fs.writeFileSync(userDataPath, jsonData, 'utf-8');
}

// Function to find the correct position using binary search
function findInsertPosition(users, newUserEmail) {
    let left = 0;
    let right = users.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (users[mid].email < newUserEmail) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return left; // This is the correct position to insert
}


function addUser(newUser) {
    const users = loadUserData(); // Load existing users
    const position = findInsertPosition(users, newUser.email); // Find correct position
    users.splice(position, 0, newUser); // Insert at the right position
    userDataPath = './data/demoUserData.json'
    saveUserData(users, userDataPath); // Save the updated user data
    console.log(`User added: ${JSON.stringify(newUser)}`);
}

function addPost(newPost) {
    const posts = loadPostData()
    posts.push(newPost)
    postDataPath = './data/demoPostData.json'
    savePostData(posts, postDataPath);
    console.log(`Post added: ${JSON.stringify(newPost)}`);

    const authorIndexData = loadAuthorIndexData();
    const authorId = newPost.authorId.toString();

    if (authorIndexData[authorId]) {
        authorIndexData[authorId].push(newPost.postId);
    } else {
        authorIndexData[authorId] = [newPost.postId];
    }

    authorIndexPath = './data/posts_author_index.json'
    saveAuthorIndexData(authorIndexData, authorIndexPath);
    console.log(`Author index updated for authorId ${authorId}`);
}

// Function to save post data
function savePostData(posts, postDataPath) {
    const jsonData = JSON.stringify(posts, null, 2);
    fs.writeFileSync(postDataPath, jsonData, 'utf-8');
}

function saveAuthorIndexData(authorIndexData, authorIndexPath) {
    fs.writeFileSync(authorIndexPath, JSON.stringify(authorIndexData, null, 2), 'utf-8');
}


// function deletePost(postId) {
//     const posts = loadPostData()
//     const postIndex = posts.findIndex(post => post.postId === postId);

//     if (postIndex !== -1) {
//         const post = posts[postIndex];

//         posts.splice(postIndex, 1);

//         posts.forEach((post, index) => {
//             post.postId = index + 1;
//         });

//         console.log(`Post with postId ${postId} deleted successfully.`);
//     } else {
//         console.log(`Post with postId ${postId} not found.`);
//     }

//     postDataPath = './data/demoPostData.json'
//     savePostData(posts, postDataPath);

//     const authorIndexData = loadAuthorIndexData();

//     if (authorIndexData[postId]) {
//         authorIndexData[postId].remove()

//     authorIndexPath = './data/posts_author_index.json'
//     saveAuthorIndexData(authorIndexData, authorIndexPath);
//     console.log(`Author index updated for authorId ${authorId}`);
// }

function deletePost(postId) {
    const posts = loadPostData();
    const postIndex = posts.findIndex(post => post.postId === postId);

    if (postIndex !== -1) {
        const post = posts[postIndex];

        posts.splice(postIndex, 1);

        posts.forEach((post, index) => {
            post.postId = index + 1;
        });

        console.log(`Post with postId ${postId} deleted successfully.`);

        savePostData(posts, './data/demoPostData.json');

        const authorIndexData = loadAuthorIndexData();
        const authorId = post.authorId;

        if (authorIndexData[authorId]) {
            authorIndexData[authorId] = authorIndexData[authorId].filter(id => id !== postId);

            if (authorIndexData[authorId].length === 0) {
                delete authorIndexData[authorId];
            }

            console.log(`Author index updated for authorId ${authorId}.`);
        }

        saveAuthorIndexData(authorIndexData, './data/posts_author_index.json');
    } else {
        console.log(`Post with postId ${postId} not found.`);
    }
}




module.exports = { addUser, addPost, deletePost }