# Add test script test_load.py
from chatbot import DeepSeekChatbot

def test_model_loading():
    chatbot = DeepSeekChatbot()
    chatbot.load_model()
    print("Model loaded successfully!")

if __name__ == "__main__":
    test_model_loading()