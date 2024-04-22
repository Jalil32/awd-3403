function loadHome() {
    document.getElementById("app").innerHTML =
        "<h1>Welcome to the Homepage</h1><p>This is the homepage of your SPA.</p>";
}

function loadProfile() {
    document.getElementById("app").innerHTML =
        "<h1>Profile Page</h1><p>Welcome to your profile.</p>";
}

function loadPosts() {
    // 1) Fetch Posts (use json initially)
    posts = fetch("../post.json");
    console.log(posts);
    // 2) Dynamically load posts
}

document.addEventListener("DOMContentLoaded", function () {
    loadHome(); // Load the home page content by default
});
