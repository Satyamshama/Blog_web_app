$(document).ready(function () {
    // Initialize the Slick slider
    $('.post-slider ul').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: false, // Hide default arrows
    });

    // Event listener for custom left and right buttons
    $('#left-slider').click(function () {
        $('.post-slider ul').slick('slickPrev');
    });

    $('#right-slider').click(function () {
        $('.post-slider ul').slick('slickNext');
    });

    // Fetch and display whenever page loads
    fetchPostDetails()
});

async function fetchPostDetails() {
    const response = await fetch('/api/details');

    if (!response.ok) {
        console.log("Post Not Found");
        throw new Error("Post Not Found");
    }
    
    const { posts } = await response.json();

    for (let i = 1; i <= posts.length; i++) {
        let post = posts[i - 1];
        let id = "#post-" + i;

        document.querySelector(id + " .post-title span").innerHTML = post.title;
        document.querySelector(id + " .username span").innerHTML = post.author.username.split(' ')[0];
        // document.querySelector(id + " .date span").innerHTML = post.createdAt.substring(0, 10);
    }
}




// async function fetchPostDetails() {
//     const response = await fetch('/api/details')

//     if(!response.ok) {
//         console.log("Post Not Found")
//         throw new Error("Post Not Found")
//     }
    
//     const { posts, user } = await response.json()

//     console.log(posts)

//     for(let i=1; i<=5 ;i++) {
//         let id = "#post-" + i.toString()
//         //console.log(posts[i-1].createdAt.split('T')[0])
//         document.querySelector(id + " .post-title span").innerHTML = posts[i-1].title  
//         document.querySelector(id + " .username span").innerHTML = user.username.split(' ')
//         console.log(document.querySelector(id + " .username span")) 
//         // document.querySelector(id + " .date span").innerHTML = posts[i-1].createdAt.substring(0, 10)
//     }
// }


// Load recent posts when the page is loaded
window.addEventListener("DOMContentLoaded", loadRecentPosts);

async function loadRecentPosts() {
    try {
        const response = await fetch("/api/recent-posts");
        const posts = await response.json();
        const recentList = document.querySelector(".recent .list ul");

        recentList.innerHTML = ""; // Clear existing list items
        posts.forEach(post => {
            const listItem = document.createElement("li");
            const link = document.createElement("a");
            link.href = `./post.html?id=${post.postId}`; // Ensure each post has a postId
            link.textContent = post.title;
            listItem.appendChild(link);
            // Set color inline
            listItem.style.color = "#4a90e2";
            recentList.appendChild(listItem);
        });
    } catch (error) {
        console.error("Failed to load recent posts:", error);
    }
}


// Search posts
document.getElementById('search-button').addEventListener("click", searchPosts)

async function searchPosts() {
    const searchItem = document.getElementById('search-text').value
    const searchType = document.getElementById('search-filter').value

    // Redirect
    window.location.href = `./post.html?searchItem=${encodeURIComponent(searchItem)}&searchType=${encodeURIComponent(searchType)}`
}


// if(searchType == "Title") {
//     const response = await fetch("/api/search", {
//         method: "GET",
//         headers: { "Content-Type": "application/json"},
//         body: JSON.stringify({ searchItem, searchType })
//     })

//     if(!response.ok) {
//         alert("Post Not Found")
//         throw new Error("Post Not Found")
//     }

//     const postId = await response.json()
//     window.location.href = `./post.html?id=${postId}`
// }
// else if(searchType == "Author's Email") {
//     const response = await fetch("/api/search", {
//         method: "GET",
//         headers: { "Content-Type": "application/json"},
//         body: JSON.stringify({ searchItem, searchType })
//     })

//     if(!response.ok) {
//         alert("Post Not Found")
//         throw new Error("Post Not Found")
//     }

//     const posts = await response.json()
//     module.exports = posts
//     window.location.href('./post.html')
// }