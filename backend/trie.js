class TrieNode {
    constructor() {
        this.children = {};
        this.postIds = [];
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(title, postId) {
        let node = this.root;

        for (const char of title) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
            if (!node.postIds.includes(postId)) {
                node.postIds.push(postId);
            }
        }
    }

    delete(title, postId) {
        const deleteHelper = (node, title, depth = 0) => {
            if (!node) return false;

            if (depth === title.length) {
                node.postIds = node.postIds.filter(id => id !== postId);

                return Object.keys(node.children).length === 0 && node.postIds.length === 0;
            }

            const char = title[depth];
            const shouldDeleteChild = deleteHelper(node.children[char], title, depth + 1);

            if (shouldDeleteChild) {
                delete node.children[char];

                return Object.keys(node.children).length === 0 && node.postIds.length === 0;
            }

            return false;
        };

        deleteHelper(this.root, title);
    }

    searchByPrefix(prefix) {
        let node = this.root;

        for (const char of prefix) {
            if (!node.children[char]) {
                return [];
            }
            node = node.children[char];
        }
        
        return node.postIds;
    }
}



function addPostInTrie(newPost, titleTrie, posts) {
    // posts.push(newPost);
    titleTrie.insert(newPost.title, newPost.postId);
}

function deletePostFromTrie(postId, titleTrie, posts) {
    const postIndex = posts.findIndex(post => post.postId === postId);

    if (postIndex !== -1) {
        const post = posts[postIndex];

        titleTrie.delete(post.title, post.postId);

        console.log(`Post with postId ${postId} deleted successfully from Trie.`);
    } else {
        console.log(`Post with postId ${postId} not found.`);
    }
}

module.exports = { Trie, addPostInTrie, deletePostFromTrie }






