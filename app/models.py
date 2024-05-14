from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from typing import Optional, List
import sqlalchemy as sa
import sqlalchemy.orm as so
from app import db#, login
from hashlib import md5
from dataclasses import dataclass

# flask db migrate - generates a migration script (needs to be incorporated into git source control idk how yet)
# flask db upgrade - updates the database but doesn't destroy any existing data


class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), index=True, unique=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256)) #remove nullable later
    posts: so.WriteOnlyMapped['Post'] = so.relationship('Post', back_populates='author')
    comments: so.WriteOnlyMapped['Comment'] = so.relationship('Comment', back_populates='author')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Post(db.Model):
    __tablename__ = 'posts'
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(sa.String(100))
    body: so.Mapped[str] = so.mapped_column(sa.String(1000))
    timestamp: so.Mapped[datetime] = so.mapped_column(sa.DateTime(timezone=True), index=True, default=datetime.now(timezone.utc))
    user_id: so.Mapped[int] =so.mapped_column(sa.ForeignKey(User.id), index=True)
    rating: so.Mapped[int] = so.mapped_column(sa.Integer())
    author: so.Mapped[User] = so.relationship('User', back_populates='posts')
    image_path: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)
    comments: so.Mapped[List['Comment']] = so.relationship('Comment', back_populates='post')
    def as_dict(self):
        """Dictionary representation of the SQLAlchemy model."""
        return {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "timestamp": self.timestamp.isoformat(),
            "user_id": self.user_id,
            "rating": self.rating,
            "image_path": self.image_path,
            "author": self.author.username,
            "comments": [comment.as_dict() for comment in self.comments]
        }

    def __repr__(self):
        return '<Post []>'.format(self.body)

class Comment(db.Model):
    __tablename__ = 'comments'
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    user_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('users.id'))
    post_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey('posts.id'), index=True)
    comment: so.Mapped[str] = so.mapped_column(sa.String(140))
    timestamp: so.Mapped[datetime] = so.mapped_column(sa.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True)
    author: so.Mapped[User] = so.relationship('User', back_populates='comments')
    post: so.Mapped[Post] = so.relationship('Post', back_populates='comments')

    def as_dict(self):
        """Dictionary representation of the SQLAlchemy model."""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "post_id": self.post_id,
            "comment": self.comment,
            "timestamp": self.timestamp.isoformat(),
            "author": self.author.username  # Assuming you want to show the username of the author
        }

    def __repr__(self):
        return f'<Comment {self.comment}>'
