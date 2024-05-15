window.onload = function fetchUserPostHistory() {
    //to do: query db for user specific posts
    //fetch those posts

    fetch("/api/post", {
        method: "GET",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Server error, please try again later.");
            }
            return response.json();
        })
        .then((data) => {
            renderPosts(data); // Render user's posts
        })
        .catch((error) => {
            console.error("Error fetching user's post history:", error);
        });
};

function renderPosts(posts) {
    const userPostsContainer = document.getElementById("user-posts-container");
    userPostsContainer.innerHTML = ""; // Clear previous posts

    posts.forEach((post) => {
        // Create elements to display post details
        const postElement = document.createElement("div");
        postElement.classList.add("user-post");

        const title = document.createElement("h2");
        title.textContent = post.title;

        const body = document.createElement("p");
        body.textContent = post.body;

        // Append elements to post container
        postElement.appendChild(title);
        postElement.appendChild(body);

        // Append post container to user posts container
        userPostsContainer.appendChild(postElement);
    });
}
