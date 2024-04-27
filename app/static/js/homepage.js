document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('intro-text').textContent = `Ready to plate up, ${localStorage.getItem('username')}? Share a recent cook or rate last night’s dinner!`;
});

function togglePopup() {
    var overlay = document.getElementById('popupOverlay');
    overlay.style.visibility = overlay.style.visibility === 'visible' ? 'hidden' : 'visible';
}