document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("intro-text").textContent =
        `Ready to plate up, ${localStorage.getItem(
            "username",
        )}? Share a recent cook or rate last night’s dinner!`;
    toggleRating();
});

function togglePopup() {
    var overlay = document.getElementById("popupOverlay");
    overlay.style.visibility =
        overlay.style.visibility === "visible" ? "hidden" : "visible";
}

function toggleRating() {
    var rating = document.querySelector(".inline-rating");
    var postBody = document.getElementById("post-body");
    var postPicture = document.getElementById("post_picture");
    var upload = document.getElementById("upload_picture");

    if (document.getElementById("Request").checked) {
        rating.style.display = "none";
        postPicture.style.display = "none";
        upload.style.display = "none";
        postBody.placeholder = "Find a plate! Tell us what you're looking for.";
    } else {
        rating.style.display = "flex";
        postPicture.style.display = "block";
        upload.style.display = "block";
        postBody.placeholder = "Leave a review!!";
    }
}