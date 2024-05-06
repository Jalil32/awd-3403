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


function renderPosts(posts){
    const feedStart = document.getElementById('feed');

    for(let i = 0; i < posts.length; i++){
        let div = document.createElement('div');
        div.setAttribute("id", "post_container");

        let title = document.createElement('h2');
        title.setAttribute("id", "post_title");
        title.textContent=posts[i].title;

        let ratingContainer = document.createElement('div');
        if(posts[i].rating){
            ratingContainer.setAttribute("id", "feed_stars");
            let userRating = posts[i].rating;
            let stars = '';
            for(let j = 0; j < 5; j++){
                if (j < userRating) {
                    stars += '<span style="color: #FCCD5D;">★</span>';
                } else {
                    stars += '<span style="color: #ccc;">★</span>';
                }
            }
            ratingContainer.innerHTML = stars;
        }

        let user = document.createElement('p');
        user.setAttribute("id", "post_user");
        user.textContent=posts[i].author;

        let body = document.createElement('p');
        body.setAttribute("id", "post_body");
        body.textContent=posts[i].body;
        user.append(body);
        
  
        if (posts[i].image_path) {
            let imageElement = document.createElement('img');
            imageElement.setAttribute("id", "post_pic");
            console.log("it worked?");
            imageElement.src = posts[i].image_path.split('app')[1];
            div.append(title, ratingContainer, imageElement, user);
        } else {
            div.append(title, ratingContainer, user);
            console.log("it worked?");
        }
          
          feedStart.append(div);
      }
}