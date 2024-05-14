let prevScrollPos = window.scrollY;

window.addEventListener("scroll", function () {
    // current scroll position
    const currentScrollPos = window.scrollY;

    if (prevScrollPos > currentScrollPos) {
        // user has scrolled up
        document.querySelector(".navbar").classList.add("show");
    } else {
        // user has scrolled down
        document.querySelector(".navbar").classList.remove("show");
    }

    // update previous scroll position
    prevScrollPos = currentScrollPos;
});

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

function goHome() {
    window.location.href = "/";
    window.location.reload();
}

function hamburgerBar() {
    var x = document.getElementById("navList");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}
