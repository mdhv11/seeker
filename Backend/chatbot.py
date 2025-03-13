from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
import torch

class DeepSeekChatbot:
    def __init__(self, model_name="deepseek-ai/deepseek-llm-7b-chat"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            #attn_implementation="flash_attention_2",
            trust_remote_code=True,
            torch_dtype=torch.bfloat16,
            device_map="auto",
            load_in_4bit=True  # Enable for low-resource devices
        )
        self.generation_config = GenerationConfig(
            temperature=0.7,
            top_p=0.9,
            max_new_tokens=512,
            repetition_penalty=1.1
        )
        self.conversation_history = []

    def get_response(self, user_input):
        self.conversation_history.append({"role": "user", "content": user_input})
        
        inputs = self.tokenizer.apply_chat_template(
            self.conversation_history,
            add_generation_prompt=True,
            return_tensors="pt"
        ).to(self.model.device)
        
        outputs = self.model.generate(
            inputs,
            generation_config=self.generation_config,
            pad_token_id=self.tokenizer.eos_token_id
        )
        
        response = self.tokenizer.decode(
            outputs[0][inputs.shape[1]:],
            skip_special_tokens=True
        )
        
        self.conversation_history.append({"role": "assistant", "content": response})
        return response
    
    def enhanced_get_response(self, user_input):
        # Add input validation
        if not user_input.strip():
            return "Please provide a valid message"
        
        # Add context management
        if len(self.conversation_history) > 20:  # Keep last 10 exchanges
            self.conversation_history = self.conversation_history[-20:]
        
        try:
            # Add web search integration
            if "[search]" in user_input:
                query = user_input.replace("[search]", "").strip()
                search_results = self.web_search(query)
                user_input += f"\n[Search Results]: {search_results}"
            
            # Add response moderation
            inputs = self.tokenizer.apply_chat_template(
                [{"role": "system", "content": "Be helpful, ethical, and concise"}, *self.conversation_history],
                add_generation_prompt=True,
                return_tensors="pt"
            ).to(self.model.device)
            
            # Stream generation process
            response = ""
            for chunk in self.model.generate(
                inputs,
                generation_config=self.generation_config,
                pad_token_id=self.tokenizer.eos_token_id,
                streamer=self.streamer,
                max_new_tokens=1024
            ):
                response += self.tokenizer.decode(chunk, skip_special_tokens=True)
                yield response  # For streaming
                
        except Exception as e:
            return f"Error processing request: {str(e)}"

    def web_search(self, query):
        # Implement actual search integration (e.g., SerpAPI, Google Search)
        import requests
        results = requests.get(f"https://api.search.com/?q={query}").json()
        return results[:3]  # Return top 3 results