
window.onload = function postFeed() {

    const feedStart = document.getElementById("feed");
    posts = [
        {
            'author': 'Jalil',
            'title': "Messina Maddness",
            'body': 'Best ice cream in perth!!!'
        },
      {
          'author': 'Mary',
          'title': "Best Korean In Perth!",
          'body': 'Beautiful day in Portland!',
          'rating': '5',
          
      },
  ]
  
      for(let i = 0; i < posts.length; i++){
        let div = document.createElement('div');
        div.setAttribute("id", "post_container");

        let user = document.createElement('p');
        user.setAttribute("id", "post_user");
        user.textContent=posts[i].author;

        let title = document.createElement('h2');
        title.setAttribute("id", "post_title");
        title.textContent=posts[i].title;

        let ratingContainer = document.createElement('div');

        if(posts[i].rating){
            ratingContainer.setAttribute("class", "inline_stars");
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
        

        let body = document.createElement('p');
        body.setAttribute("id", "post_body");
        body.textContent=posts[i].body;
        
  
        if (posts[i].image) {
            let imageElement = document.createElement('img');
            imageElement.src = posts[i].image;
            div.append(user, ratingContainer, title, imageElement, body);
        } else {
            div.append(user, ratingContainer, title, body);
        }
          
          feedStart.append(div);
      }
  
    
  }
  
  function submitPost() {
      let reviewBtn = document.getElementById('Review');
  
  
      if (reviewBtn.checked){
          let starRadios = document.querySelectorAll('.inline-rating input[type="radio"]');
          let checkedStars = 0;
          starRadios.forEach(function(radio) {
              // Check if the radio button is checked
              if (radio.checked) {
                  // If checked, increment the count of checkedStars
                  checkedStars = parseInt(radio.value); // Convert the value to an integer and assign it to checkedStars
              }
          });
          const postData = {
              title: document.getElementById("post-title"),
              body: document.getElementById("post-body"),
              user_id: localStorage.getItem('user_id'),
              rating: checkedStars
          }    
         
      } else {
          const postData = {
              title: document.getElementById("post-title"),
              body: document.getElementById("post-body"),
              user_id: localStorage.getItem('user_id'),
              rating: 0
          }   
      }
  
      fetch('/submitPost',{
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
      })
      .then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              alert("Your post has been plated up!");
  
          } else {
              // Failed to submit post
              console.error('Post Submission failed:', data.message);
              alert("Sorry! Something went wrong, please refresh and try again.");
          }
      })
      .catch(error => {
          console.error('Error:', error);
      });
   
  }

  function submissionMessage(postStatus) {
    let displayArea = document.querySelector('.popup-inner');

    // Clear the display area
    displayArea.innerHTML = '';
    let response = document.createElement('p');
    // Set the id of the new element
    response.setAttribute("id", "postFeedback");

    if (postStatus === 'success'){
        // Set the text of the new element
        response.textContent = 'Your post has been plated up!';
    } else {
        // Set the text of the new element
        response.textContent = 'Sorry! We dropped this plate, please refresh and try again.';
    }

    // Append the new element to the display area
    displayArea.appendChild(response);
}
  