import unittest
from app import create_app, db
from app.models import User, Post, Comment
from werkzeug.security import generate_password_hash
from flask_jwt_extended import create_access_token, set_access_cookies
from config import TestConfig

class CommentTestCase(unittest.TestCase):

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

        # Create a post
        post = Post(title='Test Post', body='This is a test post.', user_id=self.user_id, rating=5)
        db.session.add(post)
        db.session.commit()

        self.post_id = post.id

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


    def test_create_comment(self):
        self.set_jwt_cookie(self.client, self.token)
        response = self.client.post('/api/comment', json={
            'user_id': self.user_id,
            'post_id': self.post_id,
            'comment': 'This is a test comment.'
        })
        data = response.get_json()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(data['message'], 'Comment created successfully')

if __name__ == '__main__':
    unittest.main()
