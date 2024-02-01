from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import ForeignKey, MetaData
from datetime import datetime


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy()

class Profile(db.Model, SerializerMixin):
    __tablename__ = 'profile_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.Date, nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)
    description = db.Column(db.String(400))

    # animals = db.relationship('Animal', back_populates='profile', cascade='all, delete-orphan')
    saved_animals = db.relationship('Saved_Animal', back_populates='profile', cascade='all, delete-orphan')

    serialize_rules = ['-saved_animals']


    def __repr__(self):
        return f'<Profile {self.id}>'
    
class Saved_Animal(db.Model, SerializerMixin):
    __tablename__ = 'saved_animal_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    species = db.Column(db.String(100), nullable=True)
    breed = db.Column(db.String(100), nullable=True)
    color = db.Column(db.String(100), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    img_url = db.Column(db.String(500), nullable=True)

    profile_id = db.Column(db.Integer, db.ForeignKey('profile_table.id'))

    profile = db.relationship('Profile', back_populates='saved_animals')

    def __repr__(self):
        return f'<Saved_Animal {self.id}>'

