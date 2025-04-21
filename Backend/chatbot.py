from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    GenerationConfig,
    BitsAndBytesConfig,
    TextStreamer
)
import torch
import logging

class DeepSeekChatbot:
    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.streamer = None
        self.generation_config = GenerationConfig(
            temperature=0.7,
            top_p=0.9,
            max_new_tokens=512,
            repetition_penalty=1.1,
            do_sample=True
        )
        self.conversation_history = []

    def load_model(self):
        if self.model:
            return
        
        model_name = "deepseek-ai/deepseek-llm-7b-chat"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)

        # Set fallback pad token
        if self.tokenizer.pad_token is None:
            self.tokenizer.pad_token = self.tokenizer.eos_token

        self.streamer = TextStreamer(self.tokenizer)

        try:
            if torch.cuda.is_available():
                quant_config = BitsAndBytesConfig(
                    load_in_4bit=True,
                    bnb_4bit_compute_dtype=torch.bfloat16,
                    bnb_4bit_use_double_quant=True,
                    bnb_4bit_quant_type="nf4"
                )
                self.model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    trust_remote_code=True,
                    torch_dtype=torch.bfloat16,
                    device_map="auto",
                    quantization_config=quant_config
                )
            else:
                logging.warning("CUDA not available, loading on CPU")
                self.model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    trust_remote_code=True,
                    torch_dtype=torch.float32,
                    device_map="cpu",
                    low_cpu_mem_usage=True
                )
        except RuntimeError as e:
            logging.warning(f"Quantized loading failed: {e}")
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                trust_remote_code=True,
                device_map="cpu",
                low_cpu_mem_usage=True
            )

        self.model.eval()

    def get_response(self, user_input):
        self.load_model()
        self.conversation_history.append({"role": "user", "content": user_input})

        inputs = self.tokenizer.apply_chat_template(
            self.conversation_history,
            add_generation_prompt=True,
            return_tensors="pt"
        ).to(self.model.device)

        attention_mask = inputs["input_ids"].ne(self.tokenizer.pad_token_id).to(self.model.device)

        outputs = self.model.generate(
            input_ids=inputs["input_ids"],
            attention_mask=attention_mask,
            generation_config=self.generation_config,
            pad_token_id=self.tokenizer.eos_token_id
        )

        response = self.tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[1]:],
            skip_special_tokens=True
        )

        self.conversation_history.append({"role": "assistant", "content": response})
        return response

    def enhanced_get_response(self, user_input):
        self.load_model()

        if not user_input.strip():
            return "Please provide a valid message."

        if len(self.conversation_history) > 20:
            self.conversation_history = self.conversation_history[-20:]

        self.conversation_history.append({"role": "user", "content": user_input})

        inputs = self.tokenizer.apply_chat_template(
            self.conversation_history,
            add_generation_prompt=True,
            return_tensors="pt"
        ).to(self.model.device)

        attention_mask = inputs["input_ids"].ne(self.tokenizer.pad_token_id).to(self.model.device)

        try:
            self.model.generate(
                input_ids=inputs["input_ids"],
                attention_mask=attention_mask,
                generation_config=self.generation_config,
                pad_token_id=self.tokenizer.eos_token_id,
                streamer=self.streamer,
                max_new_tokens=1024
            )
        except Exception as e:
            return f"Error during generation: {str(e)}"