from flask import Flask, request, jsonify
from transformers import AutoProcessor, Gemma3ForConditionalGeneration
from PIL import Image
import torch
import io
import os
from dotenv import load_dotenv
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


load_dotenv()
os.environ['HF_HUB_ENABLE_HF_TRANSFER'] = '1'
token = os.getenv("HF_TOKEN")
# Load model and processor once when server starts
model_id = "google/gemma-3-12b-it"
model = Gemma3ForConditionalGeneration.from_pretrained(
    model_id,
    token=token,
    device_map="auto",
    torch_dtype=torch.bfloat16
).eval()
processor = AutoProcessor.from_pretrained(model_id)

conversation_history = [
    {
        "role": "system",
        "content": [{"type": "text", "text": "You are a helpful assistant."}]
    }
]


@app.route("/chat", methods=["POST"])
def chat():
    try:
        user_text = request.form.get("text")
        image_file = request.files.get("image")

        print("Received text:", user_text)
        print("Received image:", "Yes" if image_file else "No")

        if not user_text:
            return jsonify({"error": "Text input is required."}), 400

        user_content = []

        if image_file:
            image = Image.open(io.BytesIO(image_file.read())).convert("RGB")
            print("Image successfully loaded")
            user_content.append({"type": "image", "image": image})

        user_content.append({"type": "text", "text": user_text})
        conversation_history.append({"role": "user", "content": user_content})

        inputs = processor.apply_chat_template(
            conversation_history,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt"
        ).to(model.device)

        print("Inputs moved to device:", model.device)

        input_len = inputs["input_ids"].shape[-1]

        with torch.inference_mode():
            outputs = model.generate(**inputs, max_new_tokens=256)
            generated_ids = outputs[0][input_len:]
            reply = processor.decode(generated_ids, skip_special_tokens=True)

        conversation_history.append({
            "role": "assistant",
            "content": [{"type": "text", "text": reply}]
        })

        return jsonify({"reply": reply})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
