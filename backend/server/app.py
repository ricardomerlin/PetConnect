from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask import make_response
from models import db, Profile, Saved_Animal, Foster_listing
from datetime import datetime
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt

import requests
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('CLIENT_SECRET')
CORS(app, origins=['http://localhost:5173'])
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.sqlite3'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
bcrypt = Bcrypt(app)
migrate = Migrate(app, db)

db.init_app(app)

@app.route('/')
def home():
    print(os.getenv('CLIENT_ID'))
    print(os.getenv('CLIENT_SECRET'))
    return 'Hello World!'

@app.get('/api/check_session')
def check_session():
    profile = db.session.get(Profile, session.get('user_id'))
    print(f'check session {session.get("user_id")}')
    if profile:
        return profile.to_dict(rules=['-password']), 200
    else:
        return {"message": "No user logged in"}, 401

@app.post('/api/token')
def get_token():
    response = requests.post('https://api.petfinder.com/v2/oauth2/token', data={
        'grant_type': 'client_credentials',
        'client_id': os.getenv('CLIENT_ID'),
        'client_secret': os.getenv('CLIENT_SECRET'),
    })

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch access token'}), response.status_code

    print('working')
    return jsonify(response.json())

@app.get('/api/animals')
def get_animals():
    token_response = requests.post('https://api.petfinder.com/v2/oauth2/token', data={
        'grant_type': 'client_credentials',
        'client_id': os.getenv('CLIENT_ID'),
        'client_secret': os.getenv('CLIENT_SECRET'),
    })
    access_token = token_response.json().get('access_token')

    all_animals = []
    for pageNumber in range(1, 11):
        animals_response = requests.get(f'https://api.petfinder.com/v2/animals?limit=100&page={pageNumber}', headers={
            'Authorization': f'Bearer {access_token}',
        })
        all_animals.extend(animals_response.json().get('animals', []))

    return jsonify(all_animals)

@app.get('/api/profiles')
def get_profiles():
    profiles = Profile.query.all()
    return jsonify([p.to_dict() for p in profiles])

@app.get('/api/profiles/<int:id>')
def get_profile_by_id(id):
    profile = db.session.get(Profile, id)
    if not profile:
        return {'Error': 'Profile not found.'}
    profile_dict = profile.to_dict()
    return profile_dict, 202

@app.get('/api/saved_animals')
def get_all_animals():
    animals = Saved_Animal.query.all()
    return jsonify([animal.to_dict() for animal in animals])

@app.get('/api/profile/animals')
def get_profile_animals():
    profile_id = request.args.get('profileId')
    if profile_id is not None:
        animals = Saved_Animal.query.filter_by(profile_id=profile_id).all()
        return jsonify([animal.to_dict() for animal in animals])
    else:
        return jsonify([])
    
@app.get('/api/foster_listings')
def get_foster_listings():
    foster_listings = Foster_listing.query.all()
    return jsonify([foster.to_dict() for foster in foster_listings])

@app.post('/api/save_animal')
def save_animal():
    try:
        data = request.get_json()
        print(data)

        existing_animal = Saved_Animal.query.filter_by(petfinder_id=data.get('petfinder_id')).first()

        if existing_animal:
            return {'error': 'This animal already exists within your saves'}, 400
        print('Getting ready for new saved animal')
        new_saved_animal = Saved_Animal(
            petfinder_id = data.get('petfinder_id'),
            name = data.get('name'),
            species = data.get('species'),
            breed = data.get('breed'),
            color = data.get('color'),
            age = data.get('age'),
            pic = data.get('pic'),
            profile_url = data.get('profile_url'),
            profile_id = data.get('profile_id')
        )
        print(new_saved_animal)
        print('Hello i saved?')
        db.session.add(new_saved_animal)
        db.session.commit()

        return {'message': 'Animal saved successfully'}, 201
    except Exception as e:
        print(e)
        return {'error': 'Error saving animal'}, 400

@app.post('/api/profiles')
def save_profile():
    try:
        data = request.get_json()

        # Check if username already exists in the database
        existing_profile = Profile.query.filter_by(username=data['username']).first()

        if existing_profile:
            # If the username already exists, return an error message
            return {'error': 'Profile with this username already exists'}, 400

        new_profile = Profile(
            name=data['name'],
            username=data['username'],
            password=bcrypt.generate_password_hash(data['password']),
            birthday=datetime.strptime(data['birthday'], '%Y-%m-%d').date(),
            profile_picture=data['profile_picture'],
            description=data['description']
        )

        db.session.add(new_profile)
        db.session.commit()

        return {'message': 'Profile saved successfully'}, 201
    except Exception as e:
        print(e)
        return {'error': 'Error saving profile'}, 400

@app.post('/api/foster_listings')
def post_foster_listing():
    try:
        data = request.get_json()
        print(data)
        new_foster_listing = Foster_listing(
            name = data.get('name'),
            email_address = data.get('email_address'),
            city = data.get('city'),
            state = data.get('state'),
            preference = data.get('preference'),
            profile_id = data.get('profile_id'),
            description = data.get('description')
        )
        print(new_foster_listing)
        db.session.add(new_foster_listing)
        db.session.commit()
        return {'message': 'Foster listing saved successfully'}, 201
    except Exception as e:
        print(e)
        return {'error': 'Error saving foster listing'}, 400

@app.delete('/api/animals/<int:id>')
def delete_saved_animal(id):
    try:
        animal = Saved_Animal.query.get(id)
        if not animal:
            return {'error': 'Animal not found'}, 404
        db.session.delete(animal)
        db.session.commit()
        return {'message': 'Animal deleted successfully'}, 200
    except Exception as e:
        print(e)
        return {'error': 'Error deleting animal'}, 400
    
@app.delete('/api/foster_listings/<int:id>')
def delete_foster_listing(id):
    try:
        foster_listing = Foster_listing.query.get(id)
        if foster_listing is None:
            return jsonify({'error': 'Listing not found'}), 404

        db.session.delete(foster_listing)
        db.session.commit()

        return jsonify({'message': 'Listing deleted successfully'}), 200
    except Exception as e:
        print(e)


@app.post('/api/login')
def post_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = Profile.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    session['user_id'] = user.id
    print(user.id)
    print("login")
    return jsonify({'message': 'Login successful', 'id': user.id}), 200

@app.post('/api/logout')
def post_logout():
    session.pop("user_id", None)
    return jsonify({'message': 'Logout successful'}), 200


if __name__ == '__main__':
    app.run(port=5555, debug=True)