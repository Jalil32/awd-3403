document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('intro-text').textContent = `Ready to plate up, ${localStorage.getItem('username')}? Share a recent cook or rate last night’s dinner!`;
});

function togglePopup() { 
    const overlay = document.getElementById('popupOverlay'); 
    overlay.classList.toggle('show'); 
} 