// Get references to various DOM elements
const signUpButton = document.getElementById('signUp');
const loginButton = document.getElementById('loginButton');
const loginContainer = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const signUpForm = document.getElementById('signupForm');
const signUpHeader = document.querySelector('.signup h1');
const haveAccountMessage = document.querySelector('.login-container p');
const loginHeader = document.querySelector('.login-header-container');
const signUpLink = document.getElementById('signupLink');
const signupError = document.getElementById('signupError');
const loginError = document.getElementById('loginError');

// Function to toggle the visibility of the signup and login forms
function toggleForms() {
    if (loginContainer.style.display === 'none') {
        // Show the login form and hide the signup form
        loginContainer.style.display = 'block';
        signUpForm.style.display = 'none';
        signUpHeader.style.display = 'none';
        haveAccountMessage.style.display = 'none';
        loginButton.style.display = 'none';
        loginHeader.style.display = 'block';
    } else {
        // Show the signup form and hide the login form
        loginContainer.style.display = 'none';
        signUpForm.style.display = 'block';
        signUpHeader.style.display = 'block';
        haveAccountMessage.style.display = 'block';
        loginButton.style.display = 'block';
        loginHeader.style.display = 'none';
    }
}

// Add event listener to login button to toggle forms on click
loginButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link functioning
    toggleForms();
});

// Add event listener to signup link to toggle forms on click
signUpLink.addEventListener('click', function (event) {
    event.preventDefault();
    toggleForms();
});

// Add event listener to signup form to handle form submission
signUpForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get data from form
    const formData = new FormData(this);

    // Create request object with form data
    const userSignupRequest = {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        passwordConfirm: formData.get('passwordConfirm'),
    };

    // Send POST request to signup API
    fetch('api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSignupRequest),
    })
    .then(async (response) => {
        if (!response.ok) {
            // If response is not OK, parse error message and throw error
            return response.json().then((data) => {
                throw new Error(data.message);
            });
        }
        // Parse successful response to JSON
        return response.json();
    })
    .then((data) => {
        if (data.status === 'success') {
            // Store username and user_id in localStorage
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_id', data.user_id);
            // Redirect to the homepage
            window.location.href = '/';
        }
    })
    .catch((error) => {
        // Handle and display errors
        console.error('Error:', error);
        signupError.textContent = `${error.message}`;
    });
});

// Add event listener to login form to handle form submission
loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get data from form
    const formData = new FormData(this);

    // Create request object with form data
    const userLoginRequest = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    // Send POST request to login API
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userLoginRequest),
    })
    .then(async (response) => {
        if (!response.ok) {
            // If response is not OK, parse error message and throw error
            return response.json().then((data) => {
                throw new Error(data.message);
            });
        }
        // Parse successful response to JSON
        return response.json();
    })
    .then((data) => {
        if (data.status === 'success') {
            // Store username and user_id in localStorage
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_id', data.user_id);
            // Redirect to the homepage
            window.location.href = '/';
        }
    })
    .catch((error) => {
        // Handle and display errors
        console.error('Error:', error);
        loginError.textContent = `${error.message}`;
    });
});
