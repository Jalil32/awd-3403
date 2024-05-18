from flask import Flask
from app import create_app  # Import the function to create the Flask app
# Create the Flask application
app = create_app()

if __name__ == "__main__":
    app.run()  # Set to True for development, False for production

