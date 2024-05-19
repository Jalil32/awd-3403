// Function to toggle the display style of the navigation list for smaller screens
function hamburgerBar() {
    // Get the element with the ID 'navList'
    var x = document.getElementById("navList");
    // Toggle display style of navList
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}

// Function to toggle the 'active' class on the navigation list
function toggleMenu() {
    // Get the element with the class 'nav-list'
    const navList = document.querySelector('.nav-list');

    // Toggle the 'active' class on the navigation list element
    navList.classList.toggle('active');
}
