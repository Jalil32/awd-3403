document.addEventListener("DOMContentLoaded", function () {
    // Get the element with the ID 'intro-text' and set its text content
    // to a template literal string that includes the username from localStorage
    document.getElementById("intro-text").textContent =
        `Ready to plate up, ${localStorage.getItem(
            "username",
        )}? Share a recent cook or rate last night’s dinner!`;
    
    // Call the toggleRating function to set up initial state
    toggleRating();
});

// Function to toggle the visibility of the post form popup overlay
function togglePopup() {
    var overlay = document.getElementById("popupOverlay");
    // Toggle the visibility style property of the overlay
    overlay.style.visibility =
        overlay.style.visibility === "visible" ? "hidden" : "visible";
}

// Function to toggle the display of rating elements based on a checkbox state for post form
function toggleRating() {
    // Get elements related to the rating, post body, and picture upload
    var rating = document.querySelector(".inline-rating");
    var postBody = document.getElementById("post-body");
    var postPicture = document.getElementById("post_picture");
    var upload = document.getElementById("upload_picture");

    // Check if the element with the ID 'Request' is checked
    if (document.getElementById("Request").checked) {
        // If checked, hide the rating, post picture, and upload elements
        rating.style.display = "none";
        postPicture.style.display = "none";
        upload.style.display = "none";

        // Change the placeholder text of the post body input field
        postBody.placeholder = "Find a plate! Tell us what you're looking for.";
    } else {
        // If not checked, show the rating, post picture, and upload elements
        rating.style.display = "flex";
        postPicture.style.display = "block";
        upload.style.display = "block";

        // Change the placeholder text of the post body input field
        postBody.placeholder = "Leave a review!!";
    }
}
