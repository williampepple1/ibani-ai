from fastapi import FastAPI
from transformers import AutoTokenizer, MarianMTModel

app = FastAPI()

# Load fine-tuned model
model_name = "../marian_ibani"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

@app.get("/translate")
def translate(text: str):
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    translated = model.generate(**inputs)
    result = tokenizer.decode(translated[0], skip_special_tokens=True)
    return {"translation": result}

# Run with: uvicorn api.translator_api:app --reload
