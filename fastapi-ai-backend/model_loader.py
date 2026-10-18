import os
import logging
import json
import torch
# Uncomment these when ready to use the real model
# from transformers import AutoModelForCausalLM, AutoTokenizer
# from peft import PeftModel

logger = logging.getLogger(__name__)

class MockModel:
    """A mock model to simulate inference before the real weights are provided."""
    def predict(self, text: str):
        if "gst mismatch" in text.lower():
            return {"risk": "High", "confidence": 92.5, "recommendation": "Review GST mismatch before filing."}
        elif "missing pan" in text.lower():
            return {"risk": "Medium", "confidence": 85.0, "recommendation": "PAN is missing. Please update vendor details."}
        else:
            return {"risk": "Low", "confidence": 98.2, "recommendation": "Invoice appears compliant."}

class UnslothModel:
    """
    The actual implementation for loading a model using Unsloth's FastLanguageModel.
    """
    def __init__(self, model_path: str):
        # We import here to prevent crashing if unsloth isn't installed yet when testing mocks
        #pyrefly: ignore [missing-import]
        from unsloth import FastLanguageModel
        from transformers import TextStreamer
        
        logger.info(f"Loading Unsloth Model from: {model_path}")
        self.model, self.tokenizer = FastLanguageModel.from_pretrained(
            model_name=model_path,
            max_seq_length=2048,
            load_in_4bit=True, # Recommended for Qwen 14B inference on smaller GPUs
            # token="YOUR_HF_TOKEN" # If needed for gated models
        )
        
        # Optimize for inference
        FastLanguageModel.for_inference(self.model)
        logger.info("Unsloth Model loaded successfully for inference!")

    def predict(self, text: str):
        prompt_content = f"""
You are an AI compliance expert. Analyze the following invoice text and determine the risk level.
Respond strictly in valid JSON format with the following keys: "risk" (High, Medium, Low), "confidence" (float between 0 and 100), and "recommendation" (string).

Invoice Text:
{text}
"""
        messages = [
            {"role": "user", "content": prompt_content}
        ]
        
        # Apply the exact chat template used during training
        formatted_text = self.tokenizer.apply_chat_template(
            messages,
            tokenize=False,
            add_generation_prompt=True,
            enable_thinking=False, # Disable thinking for standard JSON response
        )
        
        inputs = self.tokenizer(formatted_text, return_tensors="pt").to("cuda")
        
        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=150,
                temperature=0.1, # Low temp for strictly JSON output
                do_sample=True,
                top_p=0.8,
                top_k=20,
            )
            
        # Decode only the generated response
        response_text = self.tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        
        try:
            # Clean the output in case it wrapped it in markdown code blocks
            clean_text = response_text.replace("```json", "").replace("```", "").strip()
            result = json.loads(clean_text)
            return {
                "risk": result.get("risk", "Unknown"),
                "confidence": result.get("confidence", 0.0),
                "recommendation": result.get("recommendation", response_text)
            }
        except json.JSONDecodeError:
            logger.error(f"Failed to parse JSON from LLM response: {response_text}")
            return {
                "risk": "Error",
                "confidence": 0.0,
                "recommendation": "Failed to parse model output."
            }

def load_model(model_name_or_path: str = "./models/qwen_lora", use_mock: bool = True):
    """
    Loads either the mock model or the real Unsloth model based on the use_mock flag.
    """
    if use_mock:
        logger.info("Loading Mock Model for testing...")
        return MockModel(), None
    else:
        logger.info("Loading Real Unsloth Model...")
        model = UnslothModel(model_name_or_path)
        return model, model.tokenizer
