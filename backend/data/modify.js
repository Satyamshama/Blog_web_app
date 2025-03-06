// const fs = require("fs").promises;

// async function sortUsersByEmail() {
//     const users = JSON.parse(await fs.readFile("./user_data.json", "utf8"));
    
//     // Sort users by email
//     users.sort((a, b) => a.email.localeCompare(b.email));
    
//     await fs.writeFile("user_data.json", JSON.stringify(users, null, 2));
//     console.log("User data sorted by email.");
// }

// sortUsersByEmail();



// // Creating an Index for Efficient Email Lookup
// const fs = require("fs").promises;

// async function createSparseUserEmailIndex() {
//     const users = JSON.parse(await fs.readFile("./user_data.json", "utf8"));
//     const emailIndex = {};

//     users.forEach((user, idx) => {
//         emailIndex[user.email] = idx + 1; // Storing position in sorted array
//     });

//     await fs.writeFile("users_email_index.json", JSON.stringify(emailIndex, null, 2));
//     console.log("Sparse email index created for sorted user data.");
// }

// createSparseUserEmailIndex()


// const fs = require('fs').promises;

// async function intKey() {
//     const data = JSON.parse(await fs.readFile('./posts_author_index.json', 'utf8'));
//     const newData = {};

//     for (const key in data) {
//         newData[parseInt(key)] = data[key];
//     }

//     // Writing the transformed object back to the file (keys will still be strings in JSON)
//     await fs.writeFile("posts_author_index.json", JSON.stringify(newData, null, 2));
//     console.log("File written successfully with integer keys (as a JS object, but keys are still strings in JSON).");
// }

// // Execute the function
// intKey().catch(error => console.error("Error:", error));


class TrieNode {
    constructor() {
        this.children = {}; // To store the next characters
        this.postIds = [];  // List of postIds that complete at this node
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(title, postId) {
        let current = this.root;
        for (const char of title) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode();
            }
            current = current.children[char];
        }
        current.postIds.push(postId); // Store postId at the end of title
    }

    search(prefix) {
        let current = this.root;
        for (const char of prefix) {
            if (!current.children[char]) {
                return []; // Prefix not found
            }
            current = current.children[char];
        }
        return this.collectAllPostIds(current);
    }

    collectAllPostIds(node) {
        let results = [...node.postIds];
        for (const child in node.children) {
            results = results.concat(this.collectAllPostIds(node.children[child]));
        }
        return results;
    }
}

// Example Usage:
const posts = [
    { postId: 1, title: "Introduction to JavaScript" },
    { postId: 2, title: "JavaScript Basics" },
    { postId: 3, title: "Advanced JavaScript Techniques" },
];

const trieIndex = new Trie();
posts.forEach(post => trieIndex.insert(post.title, post.postId));

// Searching for posts with titles starting with "JavaScript"
const results = trieIndex.search("JavaScript");
console.log("Posts with titles starting with 'JavaScript':", results);


