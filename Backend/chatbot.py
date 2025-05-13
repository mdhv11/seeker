from transformers import AutoProcessor, Gemma3ForConditionalGeneration
from PIL import Image
from dotenv import load_dotenv
import torch
import os
import logging

load_dotenv()
os.environ['HF_HUB_ENABLE_HF_TRANSFER'] = '1'
token = os.getenv("HF_TOKEN")

torch.set_default_device('cuda' if torch.cuda.is_available() else 'cpu')


class Chatbot:
    def __init__(self):
        self.model_id = "google/gemma-3-12b-it"
        self.model = Gemma3ForConditionalGeneration.from_pretrained(
            self.model_id,
            cache_dir="app/models",
            token=token,
            device_map="auto",
            torch_dtype=torch.bfloat16
        ).eval()
        self.processor = AutoProcessor.from_pretrained(
            self.model_id, use_fast=True)
        self.conversation_history = [
            {
                "role": "system",
                "content": [{"type": "text", "text": "You are a helpful assistant."}]
            }
        ]

    def chat(self, user_text, image_path=None):
        user_content = []

        if image_path:
            image = Image.open(image_path).convert("RGB")
            user_content.append({"type": "image", "image": image})

        user_content.append({"type": "text", "text": user_text})

        self.conversation_history.append({
            "role": "user",
            "content": user_content
        })

        # Prepare inputs for model
        inputs = self.processor.apply_chat_template(
            self.conversation_history,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt"
        ).to(self.model.device)

        input_len = inputs["input_ids"].shape[-1]

        with torch.inference_mode():
            output = self.model.generate(**inputs, max_new_tokens=256)
            reply_ids = output[0][input_len:]
            reply = self.processor.decode(reply_ids, skip_special_tokens=True)

        # Save assistant reply in conversation
        self.conversation_history.append({
            "role": "assistant",
            "content": [{"type": "text", "text": reply}]
        })

        return reply
