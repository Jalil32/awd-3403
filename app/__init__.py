from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config

# Initialize the Flask application
db = SQLAlchemy()  # Declare db without initializing it yet
jwt = JWTManager()  # Same for JWT
migrate = Migrate()  # Delayed initialization

def create_app():
    app = Flask(__name__)  # Create the Flask app
    app.config.from_object(Config)  # Load configurations

    # Now initialize extensions
    db.init_app(app)  # Initialize SQLAlchemy with the app
    jwt.init_app(app)  # Initialize JWT with the app
    migrate.init_app(app, db)  # Initialize migrations with the app and db

    from app.routes import routes  # Import the blueprint here
    app.register_blueprint(routes)  # Register the blueprint

    return app  # Return the initialized app
