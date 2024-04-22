from flask import render_template
from app import app

@app.route("/login", methods=["GET", "POST"])
def signup():
    user = {'username': 'Miguel'}
    posts = [
        {
            'author': {'username': 'John'},
            'body': 'Beautiful day in Portland!'
        },
        {
            'author': {'username': 'Susan'},
            'body': 'The Avengers movie was so cool!'
        }
    ]
    return render_template('login.html', title='Home', user=user, posts=posts)

# @app.route("/user/<username>", methods=["GET", "POST"])
# def show_user_profile(username):
 
#     return 'User %s' % username
