from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask import make_response
from models import db, Profile, Saved_Animal
from datetime import datetime
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt

import requests
import os

load_dotenv()

app = Flask(__name__)
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
    # Get the species from the request query parameters
    species = request.args.get('species')

    # Get the access token
    token_response = requests.post('https://api.petfinder.com/v2/oauth2/token', data={
        'grant_type': 'client_credentials',
        'client_id': os.getenv('CLIENT_ID'),
        'client_secret': os.getenv('CLIENT_SECRET'),
    })
    access_token = token_response.json().get('access_token')

    # Use the access token to fetch the animals
    animals_response = requests.get(f'https://api.petfinder.com/v2/animals?limit=30&species={species}', headers={
        'Authorization': f'Bearer {access_token}',
    })

    # Return the animal data
    return jsonify(animals_response.json()), animals_response.status_code

@app.get('/profiles')
def get_profiles():
    profiles = Profile.query.all()
    return jsonify([p.to_dict() for p in profiles])

@app.get('/profiles/<int:id>')
def get_profile_by_id(id):
    profile = db.session.get(Profile, id)
    if not profile:
        return {'Error': 'Profile not found.'}
    profile_dict = profile.to_dict()
    return profile_dict, 202

@app.get('/animals')
def get_saved_animals():
    animals = Saved_Animal.query.all()
    return [a.to_dict() for a in animals]

@app.post('/save_animal')
def save_animal():
    data = request.get_json()

    # Check if img_url already exists in the database
    existing_animal = Saved_Animal.query.filter_by(img_url=data['url']).first()

    if existing_animal:
        # If the img_url already exists, return an error message
        return {'error': 'Animal with this image URL already exists'}, 400

    new_saved_animal = Saved_Animal(
        name=data['name'],
        species=data['species'],
        breed = data['breeds']['mixed'] or data['breeds']['primary'] or data['breeds']['secondary'],
        color = data['colors']['primary'] or data['colors']['secondary'],
        age=data['age'],
        img_url=data['url'],
        profile_id=1
    )

    db.session.add(new_saved_animal)
    db.session.commit()

    return {'message': 'Animal saved successfully'}, 201

@app.post('/profiles')
def save_profile():
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

@app.post('/login')
def post_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = Profile.query.filter_by(username=username).first()

    if not user or not bcrypt.check_password_hash(user.password, password):
        return jsonify({'error': 'Invalid username or password'}), 401

    # Include the user's id in the response
    return jsonify({'message': 'Login successful', 'id': user.id}), 200


if __name__ == '__main__':
    app.run(port=5555, debug=True)