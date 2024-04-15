import os
from flask import Flask, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.sql import func

basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + os.path.join(basedir, 'mydatabase.db')
app.config['SQLALCHMEY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    passwordConfirm = db.Column(db.String(80), nullable=False)
    def __repr__(self):
        return '<User %r>' % self.username
    
class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String, db.ForeignKey('user.id'))
    user = db.relationship('User', backref=db.backref('posts', lazy=True))
    
    title = db.Column(db.String(100), nullable=False)
    body = db.Column(db.String(500), nullable=False)
    images = db.Column(db.String(500))
    time = db.Column(db.Time)
    date = db.Column(db.Date)
    

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
    post = db.relationship('Post', backref=db.backref('comments', lazy=True))
    
    comment = db.Column(db.String(200), nullable=False)
    time = db.Column(db.Time)
    date = db.Column(db.Date)
    

    
@app.route("/", methods=["GET", "POST"])
def signup():
    return render_template('basicLogin.html')
