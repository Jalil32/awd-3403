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

//toggling signup/login forms
function toggleForms() {
    if (loginContainer.style.display === 'none') {
        loginContainer.style.display = 'block';
        signUpForm.style.display = 'none';
        signUpHeader.style.display = 'none';
        haveAccountMessage.style.display = 'none';
        loginButton.style.display = 'none';
        loginHeader.style.display = 'block';
    } else {
        loginContainer.style.display = 'none';
        signUpForm.style.display = 'block';
        signUpHeader.style.display = 'block';
        haveAccountMessage.style.display = 'block';
        loginButton.style.display = 'block';
        loginHeader.style.display = 'none';
    }
}

loginButton.addEventListener('click', function (event) {
    event.preventDefault(); // Prevent default link functioning
    toggleForms();
});

signUpLink.addEventListener('click', function (event) {
    event.preventDefault();
    toggleForms();
});

// Signs user up and redirects to protected landing page
signUpForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission

    // Get data from form
    const formData = new FormData(this);

    // Create request object
    const userSignupRequest = {
        email: formData.get('email'),
        username: formData.get('username'),
        password: formData.get('password'),
        passwordConfirm: formData.get('passwordConfirm'),
    };

    fetch('api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSignupRequest),
    })
        .then(async (response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.status === 'success') {
                window.location.href = '/';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            signupError.textContent = `${error.message}`;
        });
});

// Logs user in and redirects to protected landing page
loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);

    const userLoginRequest = {
        email: formData.get('email'),
        password: formData.get('password'),
    };

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userLoginRequest),
    })
        .then(async (response) => {
            if (!response.ok) {
                return response.json().then((data) => {
                    throw new Error(data.message);
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data.status === 'success') {
                localStorage.setItem('username', data.username);
                window.location.href = '/';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            loginError.textContent = `${error.message}`;
        });
});
