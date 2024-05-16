import unittest
from app import create_app, db
from app.models import User
from config import TestConfig
from werkzeug.security import generate_password_hash

class AuthTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.config.from_object(TestConfig)
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def test_signup(self):
        response = self.client.post('/api/signup', json={
            'email': 'test@example.com',
            'username': 'testuser',
            'password': 'password',
            'passwordConfirm': 'password'
        })
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertIn('token', data)

    def test_login(self):
        # First, create a user
        user = User(email='test@example.com', username='testuser', password_hash=generate_password_hash('password'))
        db.session.add(user)
        db.session.commit()

        response = self.client.post('/api/login', json={
            'email': 'test@example.com',
            'password': 'password'
        })
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertIn('token', data)

    def test_logout(self):
        # Create a user and log in to get a token
        user = User(email='test@example.com', username='testuser', password_hash=generate_password_hash('password'))
        db.session.add(user)
        db.session.commit()

        response = self.client.post('/api/login', json={
            'email': 'test@example.com',
            'password': 'password'
        })
        token = response.get_json()['token']

        # Log out with the token
        response = self.client.delete('/api/logout', headers={
            'Authorization': f'Bearer {token}'
        })
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()['message'], 'Logout successful')

if __name__ == '__main__':
    unittest.main()
