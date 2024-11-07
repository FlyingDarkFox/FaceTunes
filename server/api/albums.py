from api.auth import get_spotify_access_token
from flask import Blueprint
import requests
import random
from api.emotion_range import emotion_range
album_routes = Blueprint("album_routes", __name__)

emotion_albums_cache = {}

# Get recommended albums based on the specified emotion.
@album_routes.route('/<emotion>', methods=['GET'])
def get_albums(emotion):

    tracks = []

    # Check if albums for the emotion are already cached
    if emotion in emotion_albums_cache:
        tracks = emotion_albums_cache[emotion]
    else:
        # If not cached, fetch albums from Spotify API
        access_token = get_spotify_access_token()

        if emotion not in emotion_range:
            emotion = "neutral"

        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        # Build request parameters based on emotion ranges
        params = {
            'min_valence': emotion_range[emotion]["valence"][0],
            "max_valence":emotion_range[emotion]["valence"][1],
            "min_energy": emotion_range[emotion]["energy"][0],
            "max_energy": emotion_range[emotion]["energy"][1],
            "min_danceability": emotion_range[emotion]["danceability"][0],
            "max_danceability": emotion_range[emotion]["danceability"][1],
            'seed_genres': 'pop',
            'limit': 100
        }
        try:
            response = requests.get('https://api.spotify.com/v1/recommendations', headers=headers, params=params)
            tracks = response.json().get('tracks', [])
            emotion_albums_cache[emotion] = tracks
        except Exception as err:
            return f"Error fetching tracks from Spotify: {err}"
        
    # Randomly select 8 tracks
    selected_tracks = random.sample(tracks, 8)
    albums = [{"album" : track["album"]} for track in selected_tracks]
    return albums
