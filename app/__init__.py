from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from config import Config, TestConfig
import os

# Initialize the Flask application
db = SQLAlchemy()  # Declare db without initializing it yet
jwt = JWTManager()  # Same for JWT
migrate = Migrate()  # Delayed initialization

def create_app(testing=None):
    app = Flask(__name__)  # Create the Flask app

    if os.getenv('FLASK_ENV') == 'testing':
        print("Running app with test database")
        app.config.from_object(TestConfig)
    else:
        print("Running app with production database")
        app.config.from_object(Config)

    print('Database URI:', app.config['SQLALCHEMY_DATABASE_URI'])

    # Now initialize extensions
    db.init_app(app)  # Initialize SQLAlchemy with the app
    jwt.init_app(app)  # Initialize JWT with the app
    migrate.init_app(app, db)  # Initialize migrations with the app and db

    with app.app_context():
        db.create_all()


    from app.routes import routes  # Import the blueprint here
    app.register_blueprint(routes)  # Register the blueprint

    return app  # Return the initialized app
