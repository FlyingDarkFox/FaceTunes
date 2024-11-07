from deepface import DeepFace
from flask import Blueprint, request, jsonify
image_routes = Blueprint("image_routes", __name__)

# return the first two dominant emotion from the image
@image_routes.route('/', methods=['POST'])
def analyze_face():
    try:
        image = request.json["image"]
        result = DeepFace.analyze(image, actions = ['emotion'])
        sorted_emotions = sorted(result[0]["emotion"].items(),key=lambda x: x[1], reverse=True)
        first_two_emotions = sorted_emotions[:2]
        res = {key:value for key,value in first_two_emotions}
        return res
    except Exception as error:
        return jsonify({'error': str(error)}), 500
