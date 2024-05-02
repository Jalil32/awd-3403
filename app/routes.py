from flask import Blueprint, jsonify, request, make_response, render_template, redirect, url_for
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, set_access_cookies
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
import sqlalchemy as sa
from app import db  # Import the database
from app.models import User, Post  # Import your user model
from app import jwt
import json
import os

UPLOAD_FOLDER = './app/images'

# Create a blueprint for organizing routes
routes = Blueprint("routes", __name__)  # Blueprint name and module name

@routes.route("/api/post", methods=["POST"])
def handle_post():
    """Creates a post in the database."""

    image = None

    if 'image' in request.files:
        image = request.files['image']
        print(image.filename)
        print("saving image")
        filename = secure_filename(image.filename)
        image_path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(image_path)
        print("image saved")

    json_data = json.loads(request.form.get('data'))
    print(json_data)

    if not json_data:
        return jsonify({"status": "error", "message": "No JSON data provided"}), 400


    title = json_data.get("title")
    body = json_data.get("body")
    user_id = json_data.get("user_id")
    rating = json_data.get("rating")

    if not body or body.strip() == "":
        return jsonify({"status": "error", "message": "Body is required"}), 400
    if not user_id:
        return jsonify({"status": "error", "message": "User ID is required"}), 400
    if rating is None:  # Assumes rating is required; adjust if optional
        return jsonify({"status": "error", "message": "Rating is required"}), 400

    # Validate user ID
    author = User.query.filter_by(id=user_id).first()
    if not author:
        return jsonify({"status": "error", "message": "User not found"}), 404

    # Create new Post instance
    if image:
        new_post = Post(title=title, body=body, user_id=user_id, rating=rating, author=author, image_path=image_path)
    else:
        new_post = Post(title=title, body=body, user_id=user_id, rating=rating, author=author)

    try:
        # Add the new post to the database
        db.session.add(new_post)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()  # Roll back the transaction on IntegrityError
        return jsonify({"status": "error", "message": "Failed to create post due to data integrity issue."}), 500
    except SQLAlchemyError as e:
        db.session.rollback()  # Roll back on other SQLAlchemy errors
        return jsonify({"status": "error", "message": "Database error: " + str(e)}), 500

    return jsonify(new_post.as_dict()), 201

@routes.route("/api/login", methods=["POST"])
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

    response = make_response(jsonify({"status": "success", "username": user.username, "user-id": user.id, "message": "Signup successful!", "token": access_token}))
    set_access_cookies(response, access_token)

    return response, 200


@routes.route("/api/signup", methods=["POST"])
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

    response = make_response(jsonify({"status": "success", "message": "Signup successful!", "username": username, "user_id": new_user.id, "token": access_token}))
    set_access_cookies(response, access_token)

    return response, 200

@routes.route("/login", methods=['GET'])
@jwt_required(True)
def login_page():
    if get_jwt_identity():
        return redirect(url_for('routes.homepage'))

    return render_template('login.html')

@routes.route("/", methods=['GET'])
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
    return redirect(url_for('routes.login_page'))
