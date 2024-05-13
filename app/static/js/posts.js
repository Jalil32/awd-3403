window.onload = function postFeed() {
    fetch('/api/post', {
        method: 'GET',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Server error, please try again later.');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            renderPosts(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
};

function handleSubmitComment(event) {
    event.preventDefault(); // Prevent the default form submit action
    console.log('haskdjf;aldsfjklads');

    // Get the form element and extract data
    const form = event.target;
    const textarea = form.querySelector('textarea');
    const postId = form.closest('#post_container').getAttribute('data-post-id'); // Ensure each post container has a data-post-id attribute

    console.log('commenting');

    // Create the comment data object
    const commentData = {
        user_id: localStorage.getItem('user_id'),
        post_id: postId,
        comment: textarea.value,
    };

    // Check if the textarea is empty
    if (!commentData.comment.trim()) {
        alert('Please enter a comment before submitting.');
        return;
    }

    // Send the data using the fetch API
    fetch('/api/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // or response.text() if your server responds with plain text
        })
        .then((data) => {
            console.log('Comment posted successfully:', data);
            // Clear the textarea after successful submission
            textarea.value = '';
            // Optionally, refresh comments or add the new comment directly to the DOM
        })
        .catch((error) => {
            console.error('Error posting comment:', error);
        });
}

// Example of adding the event listener to the form, adjust according to your actual DOM structure
document.addEventListener('DOMContentLoaded', () => {
    const commentForms = document.querySelectorAll('#comment_form');
    commentForms.forEach((form) => {
        form.addEventListener('submit', handleSubmitComment);
    });
});

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
                window.location.href = '/'; // Redirect to homepage
                window.location.reload();
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

function renderPosts(posts) {
    const feedStart = document.getElementById('feed');

    for (let i = posts.length - 1; i >= 0; i--) {
        let div = document.createElement('div');
        div.setAttribute('id', 'post_container');

        let title = document.createElement('h2');
        title.setAttribute('id', 'post_title');
        title.textContent = posts[i].title;

        let ratingContainer = document.createElement('div');
        if (posts[i].rating) {
            ratingContainer.setAttribute('id', 'feed_stars');
            let userRating = posts[i].rating;
            let stars = '';
            for (let j = 0; j < 5; j++) {
                stars +=
                    j < userRating
                        ? '<span style="color: #FCCD5D;">★</span>'
                        : '<span style="color: #ccc;">★</span>';
            }
            ratingContainer.innerHTML = stars;
        }

        let user = document.createElement('p');
        user.setAttribute('id', 'post_user');
        user.textContent = 'Posted by ' + posts[i].author;

        let body = document.createElement('p');
        body.setAttribute('id', 'post_body');
        body.textContent = posts[i].body;

        // Container for comments
        let commentsContainer = document.createElement('div');
        commentsContainer.setAttribute('id', 'comments_container');
        let commentsHeader = document.createElement('h3');
        commentsHeader.textContent = 'Comments';
        commentsContainer.appendChild(commentsHeader);

        // Check if there are comments and render them
        if (posts[i].comments && posts[i].comments.length > 0) {
            posts[i].comments.forEach((comment) => {
                let commentDiv = document.createElement('div');
                commentDiv.setAttribute('id', 'comment');

                let commentAuthor = document.createElement('strong');
                commentAuthor.textContent = comment.author + ': ';

                let commentText = document.createElement('span');
                commentText.textContent = comment.comment;

                commentDiv.appendChild(commentAuthor);
                commentDiv.appendChild(commentText);
                commentsContainer.appendChild(commentDiv);
            });
        } else {
            let noComments = document.createElement('p');
            noComments.textContent = 'No comments yet.';
            commentsContainer.appendChild(noComments);
        }

        // Comment form
        let commentForm = document.createElement('form');
        commentForm.setAttribute('id', 'comment_form');
        let textarea = document.createElement('textarea');
        textarea.setAttribute('id', 'comment_input');
        textarea.placeholder = 'Write a comment...';
        let submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Post';
        commentForm.appendChild(textarea);
        commentForm.appendChild(submitButton);

        // Append post elements to the post container
        if (posts[i].image_path) {
            let imageElement = document.createElement('img');
            imageElement.setAttribute('id', 'post_pic');
            imageElement.src = posts[i].image_path.split('app')[1]; // Assuming the path needs adjustment to be relative
            div.append(
                title,
                ratingContainer,
                imageElement,
                user,
                body,
                commentsContainer,
                commentForm,
            );
        } else {
            div.append(
                title,
                ratingContainer,
                user,
                body,
                commentsContainer,
                commentForm,
            );
        }

        // Append the post container to the feed
        feedStart.appendChild(div);
    }
}
