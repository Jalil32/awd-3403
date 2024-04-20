const signUpButton = document.getElementById("signUp");
const loginButton = document.getElementById("loginButton");
const loginForm = document.getElementById("login");
const signUpForm = document.getElementById("signupForm");
const signUpHeader = document.querySelector(".signup h1");
const haveAccountMessage = document.querySelector(".login-container p");
const loginHeader = document.querySelector(".login-header-container");
const signUpLink = document.getElementById("signupLink");

//toggling signup/login forms
function toggleForms() {
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        signUpForm.style.display = "none";
        signUpHeader.style.display = "none";
        haveAccountMessage.style.display = "none";
        loginButton.style.display = "none";
        loginHeader.style.display = "block";
    } else {
        loginForm.style.display = "none";
        signUpForm.style.display = "block";
        signUpHeader.style.display = "block";
        haveAccountMessage.style.display = "block";
        loginButton.style.display = "block";
        loginHeader.style.display = "none";
    }
}

loginButton.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent default link functioning
    toggleForms();
});

signUpLink.addEventListener("click", function(event) {
    event.preventDefault();
    toggleForms();
});



document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get data from form
    const formData = new FormData(this);

    // Create request object
    const userSignupRequest = {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        passwordConfirm: formData.get('passwordConfirm')
    };

    // Make AJAX request to backend
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userSignupRequest)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            // Signup successful, store user data in local storage
            localStorage.setItem('username', data.data.username);
            localStorage.setItem('userId', data.data.userId);
            localStorage.setItem('email', data.data.email);
            
            // Redirect to dashboard/display message for sucess
            window.location.href = '/dashboard';
        } else {
            // Failed signup, handle error w/message
            console.error('Signup failed:', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
