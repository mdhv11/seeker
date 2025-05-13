import logging
from flask import Flask, request, jsonify, Response
from transformers import AutoProcessor, Gemma3ForConditionalGeneration
from PIL import Image
import torch
import io
import os
from dotenv import load_dotenv
from flask_cors import CORS

try:
    from transformers import BitsAndBytesConfig
    quant_config = BitsAndBytesConfig(load_in_8bit=True)
    QUANT = True
except ImportError:
    quant_config = None
    QUANT = False
    # User may need to install bitsandbytes for quantization

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
os.environ['HF_HUB_ENABLE_HF_TRANSFER'] = '1'
token = os.getenv("HF_TOKEN")
# Load model and processor once when server starts
model_id = "google/gemma-3-12b-it"

logger.info("Loading model and processor...")
if QUANT:
    model = Gemma3ForConditionalGeneration.from_pretrained(
        model_id,
        token=token,
        device_map="auto",
        quantization_config=quant_config
    )
else:
    model = Gemma3ForConditionalGeneration.from_pretrained(
        model_id,
        token=token,
        device_map="auto",
        torch_dtype=torch.bfloat16
    )
model.eval()

# Use torch.compile if available (PyTorch 2.x)
if hasattr(torch, "compile"):
    logger.info("Compiling model with torch.compile...")
    model = torch.compile(model)

processor = AutoProcessor.from_pretrained(model_id)

conversation_history = [
    {
        "role": "system",
        "content": [{"type": "text", "text": "You are a helpful assistant."}]
    }
]

# Truncate conversation history to last 4 user+assistant turns
MAX_TURNS = 4
if len(conversation_history) > 1 + MAX_TURNS * 2:
    conversation_history[:] = [conversation_history[0]] + conversation_history[-MAX_TURNS*2:]

@app.route("/chat", methods=["POST"])
def chat():
    import time
    start_time = time.time()
    try:
        user_text = request.form.get("text")
        image_file = request.files.get("image")

        logger.info(f"Received text: {user_text}")
        logger.info(f"Received image: {'Yes' if image_file else 'No'}")

        if not user_text:
            return jsonify({"error": "Text input is required."}), 400

        user_content = []

        if image_file:
            image = Image.open(io.BytesIO(image_file.read())).convert("RGB")
            logger.info("Image successfully loaded")
            user_content.append({"type": "image", "image": image})

        user_content.append({"type": "text", "text": user_text})
        conversation_history.append({"role": "user", "content": user_content})

        logger.info("Preparing model inputs...")
        inputs = processor.apply_chat_template(
            conversation_history,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt"
        ).to(model.device)

        logger.info(f"Inputs moved to device: {model.device}")
        input_len = inputs["input_ids"].shape[-1]

        def generate_stream():
            logger.info("Starting streaming generation...")
            response_text = ""
            with torch.inference_mode():
                # Use streamer for token streaming if available
                from transformers import TextIteratorStreamer
                import threading
                streamer = TextIteratorStreamer(processor, skip_prompt=True, skip_special_tokens=True)
                gen_kwargs = dict(**inputs, max_new_tokens=128, streamer=streamer)
                thread = threading.Thread(target=model.generate, kwargs=gen_kwargs)
                thread.start()
                for new_text in streamer:
                    response_text += new_text
                    yield f"data: {new_text}\n\n"
                thread.join()
            logger.info("Streaming complete.")
            # Save assistant reply in conversation
            conversation_history.append({
                "role": "assistant",
                "content": [{"type": "text", "text": response_text}]
            })

        logger.info("Total time before generation: %.2fs", time.time() - start_time)
        return Response(generate_stream(), mimetype="text/event-stream")

    except Exception as e:
        import traceback
        logger.error(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
