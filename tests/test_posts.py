import unittest
from app import create_app, db
from app.models import User, Post
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token
from config import TestConfig

class PostTestCase(unittest.TestCase):

    def setUp(self):
        self.app = create_app()
        self.app.config.from_object(TestConfig)
        self.client = self.app.test_client()
        self.ctx = self.app.app_context()
        self.ctx.push()

        db.create_all()

        # Create a user and log in to get a token
        user = User(email='test@example.com', username='testuser', password_hash=generate_password_hash('password'))
        db.session.add(user)
        db.session.commit()

        self.user_id = user.id
        self.token = create_access_token(identity=user.id)

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.ctx.pop()

    def set_jwt_cookie(self, client, token):
        """Helper function to set the JWT cookie in the test client."""
        response = client.post('/api/login', json={
            'email': 'test@example.com',
            'password': 'password'
        })
        response = self.client.post('/set_jwt', headers={
            'Authorization': f'Bearer {token}'
        })
        return response

    def test_create_post(self):
        self.set_jwt_cookie(self.client, self.token)
        response = self.client.post('/api/post', data={
            'title': 'Test Post',
            'body': 'This is a test post.',
            'user_id': self.user_id,
            'rating': 5
        })
        data = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['status'], 'success')

    def test_get_posts(self):
        # Create a post
        post = Post(title='Test Post', body='This is a test post.', user_id=self.user_id, rating=5)
        db.session.add(post)
        db.session.commit()

        self.set_jwt_cookie(self.client, self.token)
        response = self.client.get('/api/post')
        data = response.get_json()
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

if __name__ == '__main__':
    unittest.main()
