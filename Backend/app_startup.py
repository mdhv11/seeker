import time
from app import chatbot

def load_model_on_startup():
    print("Loading model during startup...")
    start_time = time.time()
    chatbot.load_model()
    print(f"Model loaded in {time.time()-start_time:.2f}s")

if __name__ == "__main__":
    load_model_on_startup()