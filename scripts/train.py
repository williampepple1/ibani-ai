from transformers import AutoTokenizer, MarianMTModel, Trainer, TrainingArguments
from datasets import Dataset
import pandas as pd
import os

# Load dataset
df = pd.read_csv("./data/english_ibani.csv")

print(df.head())

# Load MarianMT model and tokenizer
model_name = "Helsinki-NLP/opus-mt-en-fr"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = MarianMTModel.from_pretrained(model_name)

# Tokenize dataset
def preprocess_function(examples):
    return tokenizer(examples["English"], text_target=examples["Ibani"], truncation=True, padding=True)

dataset = Dataset.from_pandas(df)
dataset = dataset.map(preprocess_function, batched=True)
dataset = dataset.train_test_split(test_size=0.1)

# Define training arguments
training_args = TrainingArguments(
    output_dir="../marian_ibani",
    evaluation_strategy="epoch",
    per_device_train_batch_size=4,
    per_device_eval_batch_size=4,
    num_train_epochs=3,
    weight_decay=0.01,
)

# Train model
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=dataset["train"],
    eval_dataset=dataset["test"],
)
trainer.train()

# Save fine-tuned model
trainer.save_model("../marian_ibani")
print("Model saved in '../marian_ibani'")
