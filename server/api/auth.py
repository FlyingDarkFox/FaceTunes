import base64
import requests
import os
from flask import Blueprint,jsonify

auth_routes = Blueprint("auth_routes", __name__)

CLIENT_ID = os.environ.get('CLIENT_ID')
CLIENT_SECRET = os.environ.get('CLIENT_SECRET')

# return the dominant emotion from the image
@auth_routes.route('/', methods=['GET'])
def get_spotify_access_token():
    auth_url = 'https://accounts.spotify.com/api/token'
    headers = {
        'Authorization': f'Basic {base64.b64encode(f"{CLIENT_ID}:{CLIENT_SECRET}".encode()).decode()}',
    }
    data = {
        'grant_type': 'client_credentials'
    }
    response = requests.post(auth_url, headers=headers, data=data)
    access_token = response.json()['access_token']
    if access_token:
        return access_token
    else:
        return jsonify( {"error" : "Failed to obtain access token."})
