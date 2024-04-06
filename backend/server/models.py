from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import ForeignKey, MetaData
from datetime import datetime


metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})

db = SQLAlchemy()

class Animal(db.Model, SerializerMixin):
    __tablename__ = 'animal_table'

    id = db.Column(db.Integer, primary_key=True)

    petfinder_id = db.Column(db.String)
    age = db.Column(db.String)
    declawed = db.Column(db.String)
    house_trained = db.Column(db.String)
    shots = db.Column(db.String)
    sex = db.Column(db.String)
    spayed_neutered = db.Column(db.String)
    special_needs = db.Column(db.String)
    primary_breed = db.Column(db.String)
    coat = db.Column(db.String)
    primary_color = db.Column(db.String)
    contact_address_city = db.Column(db.String)
    contact_address_state = db.Column(db.String)
    contact_email = db.Column(db.String)
    contact_phone = db.Column(db.String)
    good_with_cats = db.Column(db.String)
    good_with_children = db.Column(db.String)
    good_with_dogs = db.Column(db.String)
    name = db.Column(db.String)
    photo = db.Column(db.String)
    size = db.Column(db.String)
    species = db.Column(db.String)
    status = db.Column(db.String)
    url = db.Column(db.String)


class Foster_listing(db.Model, SerializerMixin):
    __tablename__ =  'foster_listing_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    email_address = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)
    state = db.Column(db.String, nullable=False)
    preference = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=True)
    
    profile_id = db.Column(db.Integer, db.ForeignKey('profile_table.id'))
    
    profile = db.relationship('Profile', back_populates='foster_listing')
    
    serialize_rules = ['-profile']

    def __repr__(self):
        return f'<Foster_list {self.id}>'
    
class Profile(db.Model, SerializerMixin):
    __tablename__ = 'profile_table'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    birthday = db.Column(db.Date, nullable=True)
    profile_picture = db.Column(db.String(500), nullable=True)
    description = db.Column(db.String(400))

    foster_listing = db.relationship('Foster_listing', back_populates='profile')
    saved_animals = db.relationship('Saved_Animal', back_populates='profile', cascade='all, delete-orphan')

    serialize_rules = ['-saved_animals']


    def __repr__(self):
        return f'<Profile {self.id}>'
    
class Saved_Animal(db.Model, SerializerMixin):
    __tablename__ = 'saved_animal_table'

    id = db.Column(db.Integer, primary_key=True)
    petfinder_id = db.Column(db.String, unique=True)
    age = db.Column(db.String)
    declawed = db.Column(db.String)
    house_trained = db.Column(db.String)
    shots = db.Column(db.String)
    sex = db.Column(db.String)
    spayed_neutered = db.Column(db.String)
    special_needs = db.Column(db.String)
    primary_breed = db.Column(db.String)
    coat = db.Column(db.String)
    primary_color = db.Column(db.String)
    contact_address_city = db.Column(db.String)
    contact_address_state = db.Column(db.String)
    contact_email = db.Column(db.String)
    contact_phone = db.Column(db.String)
    good_with_cats = db.Column(db.String)
    good_with_children = db.Column(db.String)
    good_with_dogs = db.Column(db.String)
    name = db.Column(db.String)
    photo = db.Column(db.String)
    size = db.Column(db.String)
    species = db.Column(db.String)
    status = db.Column(db.String)
    url = db.Column(db.String)
    profile_id = db.Column(db.Integer, db.ForeignKey('profile_table.id'))

    profile = db.relationship('Profile', back_populates='saved_animals')


    def __repr__(self):
        return f'<Saved_Animal {self.id}>'




    

