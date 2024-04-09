from flask import Flask, request, jsonify, session
from flask_apscheduler import APScheduler
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask import make_response
from models import db, Profile, Saved_Animal, Foster_listing, Animal
from datetime import datetime
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from base64 import b64encode

import requests
import os

scheduler = APScheduler()

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
    for pageNumber in range(1, 501):
        animals_response = requests.get(f'https://api.petfinder.com/v2/animals?limit=100&page={pageNumber}', headers={
            'Authorization': f'Bearer {access_token}',
        })
        animals = animals_response.json().get('animals', [])
        all_animals.extend(animals)
        print(pageNumber)

        for animal_data in animals:
            animal = Animal(
                petfinder_id=animal_data.get('id'),
                age=animal_data.get('age'),
                declawed=animal_data.get('attributes', {}).get('declawed'),
                house_trained = animal_data.get('attributes', {}).get('house_trained'),                
                shots=animal_data.get('attributes', {}).get('shots_current'),
                sex=animal_data.get('gender'),
                spayed_neutered=animal_data.get('attributes', {}).get('spayed_neutered'),
                special_needs=animal_data.get('attributes', {}).get('special_needs'),
                primary_breed=animal_data.get('breeds', {}).get('primary'),
                coat=animal_data.get('coat'),
                primary_color=animal_data.get('colors', {}).get('primary'),
                contact_address_city=animal_data.get('contact', {}).get('address', {}).get('city'),
                contact_address_state=animal_data.get('contact', {}).get('address', {}).get('state'),
                contact_email=animal_data.get('contact', {}).get('email'),
                contact_phone=animal_data.get('contact', {}).get('phone'),
                good_with_cats=animal_data.get('environment', {}).get('cats'),
                good_with_children=animal_data.get('environment', {}).get('children'),
                good_with_dogs=animal_data.get('environment', {}).get('dogs'),
                name=animal_data.get('name'),
                photo = animal_data.get('photos')[0].get('medium') if animal_data.get('photos') else None,
                size=animal_data.get('size'),
                species=animal_data.get('species'),
                status=animal_data.get('status'),
                url=animal_data.get('url')
            )
            db.session.add(animal)
        db.session.commit()

    return jsonify(all_animals)

@app.get('/api/animalslist')
def get_animals_list():
    animals = Animal.query.all()
    return jsonify([animal.to_dict() for animal in animals])

@scheduler.task('cron', id='job', day_of_week='*', hour=2, minute=33)
def job():
    with app.app_context():
        db.session.query(Animal).delete()
        db.session.commit()
        get_animals()

scheduler.init_app(app)
scheduler.start()

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
            id=data.get('id'),
            petfinder_id=data.get('petfinder_id'),
            age=data.get('age'),
            declawed=data.get('declawed'),
            house_trained = data.get('house_trained'),                
            shots=data.get('shots_current'),
            sex=data.get('sex'),
            spayed_neutered=data.get('spayed_neutered'),
            special_needs=data.get('special_needs'),
            primary_breed=data.get('primary_breed'),
            coat=data.get('coat'),
            primary_color=data.get('primary_color'),
            contact_address_city=data.get('contact_address_city'),
            contact_address_state=data.get('contact_address_state'),
            contact_email=data.get('contact_email'),
            contact_phone=data.get('contact_phone'),
            good_with_cats=data.get('good_with_cats'),
            good_with_children=data.get('good_with_children'),
            good_with_dogs=data.get('good_with_dogs'),
            name=data.get('name'),
            photo=data.get('photo'),
            size=data.get('size'),
            species=data.get('species'),
            status=data.get('status'),
            url=data.get('url'),
            profile_id=data.get('profile_id')
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
        name = request.form.get('name')
        username = request.form.get('username')
        password = request.form.get('password')
        birthday = datetime.strptime(request.form.get('birthday'), '%Y-%m-%d').date()
        description = request.form.get('description')

        existing_profile = Profile.query.filter_by(username=username).first()
        if existing_profile:
            return {'error': 'Profile with this username already exists'}, 400

        profile_picture = request.files.get('profile_picture')

        profile_picture_data = b64encode(profile_picture.read()).decode('utf-8')

        new_profile = Profile(
            name=name,
            username=username,
            password=bcrypt.generate_password_hash(password),
            birthday=birthday,
            profile_picture=profile_picture_data,
            description=description
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