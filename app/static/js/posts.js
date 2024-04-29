
function postSubmission() {

  var title = document.getElementById("post-title");
  var body = document.getElementById("post-body");
  var user = localStorage.getItem('username');
  

}

function submitPost() {
    var reviewBtn = document.getElementById('Review');
    var requestBtn = document.getElementById('Request');



    if (reviewBtn.checked){
        var starRadios = document.querySelectorAll('.inline-rating input[type="radio"]');
        var checkedStars = 0;
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