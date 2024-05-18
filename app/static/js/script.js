

function hamburgerBar() {
    var x = document.getElementById("navList");
    if (x.style.display === "none") {
        x.style.display = "flex";
    } else {
        x.style.display = "none";
    }
}


function toggleMenu() {
    const navList = document.querySelector('.nav-list');
    navList.classList.toggle('active');
}