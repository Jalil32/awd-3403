from flask import render_template
from app import app

@app.route("/", methods=["GET", "POST"])
def signup():
    
    return render_template('testLogin.html')

@app.route("/user/<username>", methods=["GET", "POST"])
def show_user_profile(username):
 
    return 'User %s' % username
