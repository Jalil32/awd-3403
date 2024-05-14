import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    SQLALCHMEY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = "your_secret_key_here"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=1)
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_PATH = '/'
    UPLOAD_FOLDER = 'app/images'
    JWT_COOKIE_CSRF_PROTECT = False
