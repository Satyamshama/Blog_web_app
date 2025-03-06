// Using Binary Search:
async function binarySearchByEmail(email, users) {
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


// Using Trie Data Structure:
function getPostsByTitlePrefix(prefix, titleTrie, posts) {
    const postIds = titleTrie.searchByPrefix(prefix);

    return postIds.map(id => posts.find(post => post.postId === id));
}


module.exports = { binarySearchByEmail, getPostsByTitlePrefix }

