from flask import Flask, jsonify, request
from flask_cors import CORS
from chatbot import DeepSeekChatbot
import os

app = Flask(__name__)
CORS(app)
chatbot = DeepSeekChatbot()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    response = chatbot.get_response(user_message)
    return jsonify({'response': response})

# health check endpoint
@app.route('/health')
def health_check():
    return jsonify({'status': 'healthy'}), 200

@app.route('/_ah/warmup')
def warmup():
    # Load model but keep in GPU memory
    chatbot.load_model()
    return jsonify({'status': 'warmup complete'}), 200

if __name__ == '__main__':
    # Get port from environment variable or default to 8080
    port = int(os.environ.get("PORT", 8080))
    # Use 0.0.0.0 for Cloud Run
    app.run(host='0.0.0.0', port=port)