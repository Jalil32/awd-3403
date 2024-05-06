window.onload = function postFeed() {
    const feedStart = document.getElementById('feed');
    posts = [
        {
            author: 'Mary',
            title: 'Best Korean In Perth!',
            body: 'Beautiful day in Portland!',
        },
        {
            author: 'Jalil',
            title: 'Messina Maddness',
            body: 'Best ice cream in perth!!!',
        },
        {
            author: 'Jan',
            title: "Jalil's pizza shop",
            body: 'Best pizza place in perth!!!',
        },
        {
            author: 'Jayce',
            title: 'Messina Maddness',
            body: 'Best ice cream in perth!!!',
        },
        {
            author: 'Lloyd',
            title: 'Messina Maddness',
            body: 'Best ice cream in perth!!!',
        },
    ];

    for (var i = 0; i < posts.length; i++) {
        var div = document.createElement('div');
        div.setAttribute('id', 'post_container');

        var user = document.createElement('p');
        user.setAttribute('id', 'post_user');
        user.textContent = posts[i].author;

        var title = document.createElement('h2');
        title.setAttribute('id', 'post_title');
        title.textContent = posts[i].title;

        var body = document.createElement('p');
        body.setAttribute('id', 'post_body');
        body.textContent = posts[i].body;

        div.append(user, title, body);
        feedStart.append(div);
    }
};

function submitPost(event) {
    event.preventDefault();
    console.log('submitting post');

    let reviewBtn = document.getElementById('Review');
    let postData = new FormData();

    let fileInput = document.getElementById('upload_picture');

    if (fileInput.files.length > 0) {
        postData.append('image', fileInput.files[0]);
    }

    let starRadios = document.querySelectorAll(
        '.inline-rating input[type="radio"]',
    );
    let checkedStars = 0;
    starRadios.forEach(function (radio) {
        if (radio.checked) {
            checkedStars = parseInt(radio.value); // Convert the value to an integer and assign it to checkedStars
        }
    });

    postData.append('title', document.getElementById('post-title').value);
    postData.append('body', document.getElementById('post-body').value);
    postData.append('user_id', localStorage.getItem('user_id'));
    postData.append('rating', reviewBtn.checked ? checkedStars : 0);

    fetch('/api/post', {
        method: 'POST',
        body: postData, // Send the FormData object
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Server error, please try again later.');
            }

            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.status === 'success') {
                alert('Your post has been plated up!');
            } else {
                // Failed to submit post
                console.error('Post Submission failed:', data.message);
                alert(
                    'Sorry! Something went wrong, please refresh and try again.',
                );
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}
