
window.onload = function fetchUserPostHistory() {
    // Send a GET request to fetch the user's posts from the API
    fetch(`/api/post/${localStorage.getItem("user_id")}`, {
        method: "GET",
    })
    .then((response) => {
        // If the response is not OK, throw an error
        if (!response.ok) {
            throw new Error("Server error, please try again later.");
        }
        // Convert the response to JSON
        return response.json();
    })
    .then((data) => {
        // Render the posts on the user's profile
        renderPostsforProfile(data);
    })
    .catch((error) => {
        // Log any errors that occur during the fetch
        console.error("Error fetching user's post history:", error);
    });
};

// Add an event listener to the logout button for the click event
document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        // Send a DELETE request to log out the user
        const response = await fetch("/api/logout", {
            method: "DELETE",
        });

        // If the response is OK, handle the successful logout
        if (response.ok) {
            const data = await response.json();
            // Redirect to the homepage after successful logout
            window.location.href = "/";
        } else {
            // If logout fails, show an alert
            alert("Logout failed");
        }
    } catch (error) {
        // Log any errors that occur during the logout process
        console.error("Error:", error);
        alert("An error occurred");
    }
});

// Function to render posts on the user's profile
function renderPostsforProfile(posts) {
    const userPostsContainer = document.getElementById("user-posts-container");
    userPostsContainer.innerHTML = ""; // Clear previous posts

    // If there are no posts, prompt the user to share their first post
    if (posts.length === 0) {
        let div = document.createElement("div");
        div.setAttribute("id", "post_container");
        let title = '<a href="/" id="empty_profile">Share your first plate today!</a>';
        div.innerHTML = title;
        userPostsContainer.appendChild(div);
    }

    // Iterate over the posts and render each one
    for (let i = posts.length - 1; i >= 0; i--) {
        let div = document.createElement("div");
        div.setAttribute("id", "post_container");
        div.setAttribute("post_id", posts[i].id);

        let title = document.createElement("h2");
        title.setAttribute("id", "post_title");
        title.textContent = posts[i].title;

        // Create and populate the rating container if a rating exists
        let ratingContainer = document.createElement("div");
        if (posts[i].rating) {
            ratingContainer.setAttribute("id", "feed_stars");
            let userRating = posts[i].rating;
            let stars = "";
            for (let j = 0; j < 5; j++) {
                if (j < userRating) {
                    stars += '<span style="color: #FCCD5D;">★</span>';
                } else {
                    stars += '<span style="color: #ccc;">★</span>';
                }
            }
            ratingContainer.innerHTML = stars;
        }

        let user = document.createElement("p");
        user.setAttribute("id", "post_user");
        user.textContent = "Posted by " + posts[i].author;

        let body = document.createElement("p");
        body.setAttribute("id", "post_body");
        body.textContent = posts[i].body;

        // Create and populate the comments container
        let commentsContainer = document.createElement("div");
        commentsContainer.setAttribute("id", "comments_container");

        let commentsHeader = document.createElement("h3");
        commentsHeader.textContent = "Comments";
        commentsContainer.appendChild(commentsHeader);

        // Check if there are comments and render them
        if (posts[i].comments && posts[i].comments.length > 0) {
            posts[i].comments.forEach((comment) => {
                // Container for each comment
                let commentDiv = document.createElement("div");
                commentDiv.setAttribute("id", "comment");

                let commentAuthor = document.createElement("strong");
                commentAuthor.setAttribute("id", "comment_author");
                commentAuthor.textContent = comment.author + ": ";

                let commentText = document.createElement("span");
                commentText.setAttribute("id", "comment_text");
                commentText.textContent = comment.comment;

                commentDiv.appendChild(commentAuthor);
                commentDiv.appendChild(commentText);
                commentsContainer.appendChild(commentDiv);
            });
        }

        // Append post elements to the post container
        if (posts[i].image_path) {
            let imageElement = document.createElement("img");
            imageElement.setAttribute("id", "post_pic");
            // Assuming the path needs adjustment to be relative
            imageElement.src = posts[i].image_path.split("app")[1]; 
            div.append(
                title,
                ratingContainer,
                imageElement,
                user,
                body,
                commentsContainer,
            );
        } else {
            div.append(
                title,
                ratingContainer,
                user,
                body,
                commentsContainer,
            );
        }
        userPostsContainer.appendChild(div);
    }
}
