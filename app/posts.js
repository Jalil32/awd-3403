
function postSubmission() {

  var title = document.getElementById("post-title");
  var body = document.getElementById("post-body");
  var user = localStorage.getItem('username');
  

}

function submitPost() {
    
    const postData = {
        title: document.getElementById("post-title"),
        body: document.getElementById("post-body"),
        user: localStorage.getItem('user_id')

    }


  const xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    document.getElementById("post-title").innerHTML = this.responseText;
  }
  xhttp.open("POST", "demo_post2.asp");
  xhttp.send("fname=Henry&lname=Ford");

}