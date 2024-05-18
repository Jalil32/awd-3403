import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from werkzeug.security import generate_password_hash, check_password_hash
from selenium.webdriver.support import expected_conditions as EC
from app import create_app, db
from app.models import User, Post, Comment  # Import your user model
from config import TestConfig

localHost = "http://localhost:5000/"

class SeleniumTests(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.config.from_object(TestConfig)

        self.driver = webdriver.Chrome()

        self.ctx = self.app.app_context()
        self.ctx.push()

        try:
            db.create_all()
        except Exception as e:
            print("Failed to create tables:", e)

    def tearDown(self):
        self.driver.quit()
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_1_signup(self):
        self.driver.get(localHost + 'login')
        # Fill out the signup form
        username = self.driver.find_element(By.NAME, 'username')
        username.send_keys('testuser')

        email = self.driver.find_element(By.NAME, 'email')
        email.send_keys('testuser@example.com')

        password = self.driver.find_element(By.NAME, 'password')
        password.send_keys('securepassword123')

        password_confirm = self.driver.find_element(By.NAME, 'passwordConfirm')
        password_confirm.send_keys('securepassword123')

        # Submit the form
        signup_button = self.driver.find_element(By.CSS_SELECTOR, '#signupForm input[type="submit"]')
        signup_button.click()

            # Example of waiting for a redirect and checking if logged in
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, 'nav-title'))  # Adjust ID as needed
        )

    def create_test_user(self):
        email="testuser@example.com"
        password="securepassword123"
        username="testusername"
        user = User(email=email, username=username, password_hash=generate_password_hash(password, method="pbkdf2:sha256:600000"))
        db.session.add(user)
        db.session.commit()

    def test_2_login_success(self):
        self.create_test_user()
        # Navigate to the login page
        self.driver.get(localHost + 'login')


        login_btn = self.driver.find_element(By.ID, 'loginButton')
        login_btn.click()

        # Input login credentials (assumes email and password fields and login button are correctly identified)
        email_input = self.driver.find_element(By.ID, 'loginEmail')
        email_input.send_keys('testuser@example.com')  # Replace with valid credentials

        password_input = self.driver.find_element(By.ID, 'loginPassword')
        password_input.send_keys('securepassword123')  # Replace with valid credentials

        # Click the login button
        login_button = self.driver.find_element(By.ID, 'loginSubmit')
        login_button.click()

        # Wait for navigation to the user's dashboard or a similar page after successful login
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, 'nav-title'))  # Adjust the ID as needed
        )
