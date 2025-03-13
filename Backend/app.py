from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import DeepSeekChatbot

app = Flask(__name__)
CORS(app)
chatbot = DeepSeekChatbot()

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    response = chatbot.get_response(user_message)
    return jsonify({'response': response})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)