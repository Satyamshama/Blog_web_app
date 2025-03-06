const fs = require('fs');
const { Trie, addPostInTrie, deletePostFromTrie } = require("./trie.js")
const { loadUserData, loadPostData, loadAuthorIndexData } = require('./readData.js')

const users = loadUserData()
const posts = loadPostData()
const authorIndex = loadAuthorIndexData()
let userId

function displayPosts(userId) {
    const id = userId.toString();
    const allPosts = authorIndex[id];

    if (!allPosts) {
        console.log("No posts available");
        return;
    }

    allPosts.forEach(postId => {
        if (posts[postId]) {
            console.log(posts[postId]);
        } else {
            console.log(`Post with ID ${postId} not found in post data.`);
        }
    });
}


// BTree
const BTree = require('./b-tree.js');

const degree = 3;
const emailBTree = new BTree(degree);

users.forEach(user => {
    emailBTree.insert(user.email, user.userId);
});


// Trie
function getPostsByTitlePrefix(prefix, titleTrie) {
    const postIds = titleTrie.searchByPrefix(prefix);

    return postIds.map(id => posts.find(post => post.postId === id));
}



// Title Hash
class HashIndex {
    constructor() {
        this.index = {};
    }

    insert(title, postId) {
        const hash = this.generateHash(title);
        this.index[hash] = postId;
    }

    search(title) {
        const hash = this.generateHash(title);
        return this.index[hash] || null;
    }

    generateHash(title) {
        let hash = 0;
        for (const char of title) {
            hash = (hash << 5) - hash + char.charCodeAt(0);
            hash = hash & hash;
        }
        return hash;
    }
}




// Search
// 1. Using Email:

// a) Using a B-Tree:

function findUserByEmail(email) {
    const userId = emailBTree.findUserIdByEmail(email);
    if (userId !== null) {
        console.log(`User found`);
    } else {
        console.log("User not found.");
    }
}


// b) Using Binary Search:
async function binarySearchByEmail(email) {
    let left = 0;
    let right = users.length - 1;

    // console.time("Execution")
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midEmail = users[mid].email;

        if (midEmail === email) return users[mid];
        else if (midEmail < email) left = mid + 1;
        else right = mid - 1;
    }
    return null;
}


// c) Using a Hash-Map:
const emailHashMap = {};

users.forEach(user => {
    emailHashMap[user.email] = user.userId;
});


(async () => {
    const email = 'lhriinchenkog@rediff.com'

    // B-Tree search
    console.log("Search using B-Tree");
    console.time("BTreeExecution");
    findUserByEmail(email);
    console.timeEnd("BTreeExecution");

    // Binary Search
    console.log("Search using Binary-Search");
    console.time("BinarySearchExecution");
    userId = await binarySearchByEmail(email); 
    console.timeEnd("BinarySearchExecution");
    console.log(`User Id from Binary Search: ${userId}`);

    // Hash-Map search
    console.log("Search using Hash-Map");
    console.time("HashMapExecution");
    userId = emailHashMap[email];
    console.timeEnd("HashMapExecution");
    console.log(`User Id from Hash-Map: ${userId}`);

    displayPosts(userId);
})();





// 2. Using Title:

// a) Using Trie Data Structure:
const titleTrie = new Trie();

posts.forEach(post => {
    titleTrie.insert(post.title, post.postId);
});

// Example usage:
const prefix = "quaerat velit";
console.time('Trie')
const matchingPosts = getPostsByTitlePrefix(prefix, titleTrie);
console.timeEnd('Trie')
console.log(`Posts with titles starting with '${prefix}':`, matchingPosts);


// b) Hashing:


// Example Usage:
const hashIndex = new HashIndex();
posts.forEach(post => hashIndex.insert(post.title, post.postId));

console.time('Hashing')
const postId = hashIndex.search("quaerat velit veniam amet cupiditate aut numquam ut sequi");
console.timeEnd('Hashing')
console.log(`Post ID:`, postId);
console.log(posts[postId - 1]);



// Insert:

// // 1. Insert a new User
const { addUser, addPost, deletePost } = require('./insert.js')

// const BTree = require('./b-tree.js');

// const degree = 3;
// const emailBTree = new BTree(degree);

// users.forEach(user => {
//     emailBTree.insert(user.email, user.userId);
// });


// Example usage:
const newUser = {
    userId: 52,
    username: "Beatrix",
    password: "Xc8*VmY^f$1",
    email: "bkingdom@domain.com"
};

addUser(newUser); 
emailBTree.insert(newUser.email, newUser.userId)
console.log("New user added and BTree updated.");


// 2. Insert a new Post
// const titleTrie = new Trie();

// posts.forEach(post => {
//     titleTrie.insert(post.title, post.postId);
// });

// Example usage:
const newPost = {
    postId: 106,
    title: "new exciting title",
    content: "content of the new exciting post",
    authorId: 42
};

addPost(newPost)
addPostInTrie(newPost, titleTrie, posts);
console.log("New post added and Trie updated.");




// Deleting an existing post
// const titleTrie = new Trie();

// posts.forEach(post => {
//     titleTrie.insert(post.title, post.postId);
// });

deletePostFromTrie(106, titleTrie, posts)
deletePost(106);

console.log("Post deleted and Trie updated.");