"""Added image column to posts

Revision ID: 7bb16a90c4ea
Revises: 6a32aadf921c
Create Date: 2024-04-29 21:06:57.976793

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '7bb16a90c4ea'
down_revision = '6a32aadf921c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_path', sa.String(length=140), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('post', schema=None) as batch_op:
        batch_op.drop_column('image_path')

    # ### end Alembic commands ###
