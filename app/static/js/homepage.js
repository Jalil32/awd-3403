document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('intro-text').textContent = `Ready to plate up, ${localStorage.getItem('username')}?`;
});