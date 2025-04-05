from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot import DeepSeekChatbot

app = FastAPI()
chatbot = DeepSeekChatbot()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(req: MessageRequest):
    user_message = req.message
    response = chatbot.get_response(user_message)
    return { "response": response }
