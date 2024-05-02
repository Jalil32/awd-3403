from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from typing import Optional
import sqlalchemy as sa
from sqlalchemy.orm import class_mapper
import sqlalchemy.orm as so
from app import db#, login
from hashlib import md5
from dataclasses import dataclass

# flask db migrate - generates a migration script (needs to be incorporated into git source control idk how yet)
# flask db upgrade - updates the database but doesn't destroy any existing data


class User(UserMixin, db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    username: so.Mapped[str] = so.mapped_column(sa.String(64), index=True, unique=True)
    email: so.Mapped[str] = so.mapped_column(sa.String(120), index=True, unique=True)
    password_hash: so.Mapped[Optional[str]] = so.mapped_column(sa.String(256)) #remove nullable later

    posts: so.WriteOnlyMapped['Post'] = so.relationship(back_populates='author')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User {}>'.format(self.username)

class Post(db.Model):
    id: so.Mapped[int] = so.mapped_column(primary_key=True)
    title: so.Mapped[str] = so.mapped_column(sa.String(100))
    body: so.Mapped[str] = so.mapped_column(sa.String(1000))
    timestamp: so.Mapped[datetime] = so.mapped_column(sa.DateTime(timezone=True), index=True, default=datetime.now(timezone.utc))
    user_id: so.Mapped[int] =so.mapped_column(sa.ForeignKey(User.id), index=True)
    rating: so.Mapped[int] = so.mapped_column(sa.Integer())
    author: so.Mapped[User] = so.relationship(back_populates='posts')
    image_path: so.Mapped[str] = so.mapped_column(sa.String(140), nullable=True)

    #comments: so.WriteOnlyMapped['Post'] = so.relationship(back_populates='post')
    def as_dict(self):
        """Dictionary representation of the SQLAlchemy model."""
        return {c.name: getattr(self, c.name) for c in class_mapper(self.__class__).columns}

    def __rpr__(self):
        return '<Post []>'.format(self.body)

# class Comment(db.Model):
#     id: so.Mapped[int] = so.mapped_column(primary_key=True)
#     user_id: so.Mapped[str] = so.mapped_column(sa.ForeignKey(User.id), index=False)
#     author: so.Mapped[User] = so.relationship(back_populates='comments')
#     post_id: so.Mapped[int] = so.mapped_column(sa.ForeignKey(Post.id), index=True)
#     post: so.Mapped[User] = so.relationship(back_populates='comments')
#     comment: so.Mapped[str] = so.mapped_column(sa.String(140))
#     timestamp: so.Mapped[datetime] = so.mapped_column(index=True, default=lambda: datetime.now(timezone.utc))


# @login.user_loader
# def load_user(id):
#     return db.session.get(User, int(id))