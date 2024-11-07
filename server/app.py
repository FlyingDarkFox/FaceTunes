from flask import Flask
from flask_cors import CORS
from api.images import image_routes
from api.auth import auth_routes
from api.albums import album_routes
from dotenv import load_dotenv
import os
app = Flask(__name__)

load_dotenv(dotenv_path='../.env')
FLASK_PORT = os.environ.get('FLASK_PORT')

app.register_blueprint(image_routes, url_prefix="/api/images")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(album_routes, url_prefix="/api/albums")

CORS(app)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=FLASK_PORT)
