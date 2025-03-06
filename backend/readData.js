const fs = require('fs');
const userDataPath = './data/demoUserData.json'
const postDataPath = './data/demoPostData.json'
const postAuthorIndexPath = './data/posts_author_index.json'

function loadUserData() {
    const rawData = fs.readFileSync(userDataPath);
    return JSON.parse(rawData);
}

function loadPostData() {
    const rawData = fs.readFileSync(postDataPath);
    return JSON.parse(rawData);
}

function loadAuthorIndexData() {
    const rawData = fs.readFileSync(postAuthorIndexPath);
    return JSON.parse(rawData);
}


module.exports = { loadUserData, loadPostData, loadAuthorIndexData }



