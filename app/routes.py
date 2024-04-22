from flask import render_template
from app import app

@app.route("/", methods=["GET", "POST"])
def signup():
    user = {'username': 'Miguel'}
    # email = "jalil2212@gmail.com"
    # password = "1222123"
    # username = "jali2lly"
    # passwordconf = "1222123"
    # new_user = User(username=username, email=email, password=password, passwordConfirm=passwordconf)
    #db.session.commit()
    
    return render_template('testLogin.html', user=user)

@app.route("/user/<username>", methods=["GET", "POST"])
def show_user_profile(username):
 
    return 'User %s' % username
