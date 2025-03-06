const urlParams = new URLSearchParams(window.location.search)

if (urlParams.has("id")) {
    const postId = urlParams.get('id')
    // Fetch and display post details
    fetchPost(postId)
}
else {
    // Display all posts of the respective author
    searchPosts(urlParams)
}

async function fetchPost(postId) {
    const response = await fetch(`/api/posts/${postId}`)

    if(!response.ok) {
        console.log("Post Not Found")
        throw new Error("Post Not Found")
    }

    const post = await response.json()

    const main = document.querySelector('main')
    // Create Element
    const h1 = document.createElement('h1')
    const p = document.createElement('p')
    
    h1.id = "post-title-layout"
    h1.innerText = post[0].title
    p.id = "post-content-layout"
    p.innerText = post[0].content

    main.appendChild(h1)
    main.appendChild(p)

    // Display post
    //document.getElementById("post-title-layout").innerText = post[0].title
    //document.getElementById("post-content-layout").innerText = post[0].content
}

async function searchPosts(urlParams) {
    const searchItem = urlParams.get("searchItem");
    const searchType = urlParams.get("searchType");
    console.log(searchItem)
    console.log(searchType)

    if (searchType === "title") {
        // Search by title: Fetch and display a single post
        fetchPostByTitle(searchItem);
    } else if (searchType === "author") {
        // Search by author's email: Fetch and display all posts by this author
        fetchPostsByAuthor(searchItem);
    }
}

// Fetch and display a single post by title
async function fetchPostByTitle(title) {
    try {
        const response = await fetch(`/api/posts/title/${encodeURIComponent(title)}`);
        if (!response.ok) throw new Error("Post not found");

        const post = await response.json();
        displaySinglePost(post);
    } catch (error) {
        console.error(error);
        document.querySelector('main').innerText = "Post not found.";
    }
}

// Fetch and display all posts by author email
async function fetchPostsByAuthor(authorEmail) {
    try {
        const response = await fetch(`/api/posts/author/${encodeURIComponent(authorEmail)}`);
        if (!response.ok) throw new Error("No posts found for this author");

        const posts = await response.json();
        displayPostsList(posts);
    } catch (error) {
        console.error(error);
        document.querySelector('main').innerText = "Noposts found for this author.";
    }
}

// Display a single post
function displaySinglePost(post) {
    const main = document.querySelector('main');

    const title = document.createElement('h1');
    title.id = "post-title-layout";
    title.innerText = post.title;

    const content = document.createElement('p');
    content.id = "post-content-layout";
    content.innerText = post.content;

    main.appendChild(title);
    main.appendChild(content);
}

// Display a list of posts as links for an author
function displayPostsList(posts) {
    const main = document.querySelector('main');
    const list = document.createElement('ul');

    posts.forEach(post => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `./post.html?id=${post.postId}`;
        link.innerText = post.title;
        link.style.cssText = "font-size: 30px; text-decoration: none;";
        
        listItem.appendChild(link);
        list.appendChild(listItem);
    });

    main.appendChild(list);
}


