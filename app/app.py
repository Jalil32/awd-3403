import os
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import funcfilter


basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + os.path.join(basedir, 'mydatabase.db')
app.config['SQLALCHMEY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

with app.app_context():
    db.create_all()

    
@app.route("/", methods=["GET", "POST"])
def signup():
    user = {'username': 'Miguel'}
    # email = "jalil2212@gmail.com"
    # password = "1222123"
    # username = "jali2lly"
    # passwordconf = "1222123"
    # new_user = User(username=username, email=email, password=password, passwordConfirm=passwordconf)
    db.session.commit()
    
    return render_template('testLogin.html', user=user)

@app.route("/user/<username>", methods=["GET", "POST"])
def show_user_profile(username):
 
    return 'User %s' % username
