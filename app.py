import os
from flask import Flask, make_response, jsonify, flash, render_template, request, url_for, redirect
from flask_sqlalchemy import SQLAlchemy
import sqlalchemy as sa
from sqlalchemy.sql import func
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity, set_refresh_cookies, set_access_cookies
from datetime import timedelta


basedir = os.path.abspath(os.path.dirname(__file__))
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///' + os.path.join(basedir, 'mydatabase.db')
app.config['SQLALCHMEY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "your_secret_key_here"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=1)
app.config["JWT_TOKEN_LOCATION"] = ["cookies"]
app.config["JWT_COOKIE_NAME"] = "jwtToken"
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api/'

jwt = JWTManager(app)
db = SQLAlchemy(app)


@app.cli.command("create-db")
def create_db():
    """Creates database from SQLAlchemy models."""
    db.create_all()
    print("Database created!")

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(80), nullable=False)
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

@app.route("/api/login", methods=["POST"])
def handle_login():
    """Checks users credentials and logs them into the application"""
    json_data = request.get_json()

    if not json_data:
        return jsonify({"status": "error", "message": "No JSON data provided"}), 400

    email = json_data.get("email")
    password = json_data.get("password")

    # Check for required fields
    if not email or not password:
        return jsonify({"status": "error", "message": "Email and password are required"}), 400

    # Find user by email
    user = User.query.filter_by(email=email).first()

    # Validate user existence and password
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"status": "error", "message": "Invalid email or password"}), 401  # 401 for unauthorized

    # Generate a JWT token for the user
    access_token = create_access_token(identity=user.id)

    response = make_response(jsonify({"status": "success", "message": "Signup successful!", "token": access_token}))
    set_access_cookies(response, access_token)

    return response, 200


@app.route("/api/signup", methods=["POST"])
def handle_signup():
    """Validates user data and signs user up."""
    json_data = request.get_json()

    # Check if JSON data is provided
    if not json_data:
        return jsonify({"status": "error", "message": "No JSON data provided"}), 400

    email = json_data.get("email")
    username = json_data.get("username")
    password = json_data.get("password")
    passwordConfirm = json_data.get("passwordConfirm")

    # Check for missing fields
    if not email or not username or not password or not passwordConfirm:
        return jsonify({"status": "error", "message": "Email, username, and both passwords are required"}), 400

    # Ensure passwords match
    if password != passwordConfirm:
        return jsonify({"status": "error", "message": "Passwords do not match"}), 400

    # Check if user already exists
    user = User.query.filter_by(email=email).first()
    if user:
        return jsonify({"status": "error", "message": "User with this email already exists"}), 409

    # Create new user with hashed password
    new_user = User(email=email, username=username, password_hash=generate_password_hash(password, method="pbkdf2:sha256:600000"))

    user_name_check = db.session.scalar(sa.select(User).where(User.username == username))

    if user_name_check is not None:
        return jsonify({"status": "error", "message": "Username taken. Please choose another."}), 500

    try:
        # Add the new user to the database
        db.session.add(new_user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()  # Roll back the transaction on error
        return jsonify({"status": "error", "message": "Database error. Please try again later."}), 500

    # Generate JWT token upon successful signup
    access_token = create_access_token(identity=new_user.id)

    response = make_response(jsonify({"status": "success", "message": "Signup successful!", "token": access_token}))

    set_access_cookies(response, access_token)
    return response, 200

@app.route("/login", methods=['GET'])
@jwt_required(True)
def login_page():
    if get_jwt_identity():
        return redirect(url_for('homepage'))

    return render_template('login.html')

@app.route("/", methods=['GET'])
@jwt_required()
def homepage():
    user_id = get_jwt_identity()
    print(user_id)

    user = User.query.get(user_id)

    if not user:
        return jsonify({"status": "error", "message": "User not found"}), 404

    return render_template('home_page.html')

@jwt.unauthorized_loader
def handle_missing_jwt_token(error):
    return jsonify({
        "status": "error",
        "message": "Missing or invalid token. Please log in."
    }), 401  # Return a 401 Unauthorized status
