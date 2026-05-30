from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import os
import pickle
import numpy as np
from groq import Groq
from PIL import Image
 
app = Flask(__name__)
CORS(app)
 
# ─── Load Models ───────────────────────────────────────────────
# 1. Groq client (Agentic AI)
groq_client = Groq(api_key="YOUR_GROQ_API_KEY_HERE")
 
# 2. Twitter Sentiment (.pkl)
try:
    import torch
    from transformers import DistilBertForSequenceClassification
 
    with open('twitter_model_cpu.pkl', 'rb') as f:
        twitter_saved = pickle.load(f)
 
    twitter_tokenizer = twitter_saved['tokenizer']
    twitter_id2label  = twitter_saved['id2label']
    twitter_label2id  = twitter_saved['label2id']
 
    twitter_model = DistilBertForSequenceClassification.from_pretrained(
        'distilbert-base-uncased', num_labels=3
    )
    # Force CPU loading — fix for CUDA mismatch
    state_dict = {k: v.cpu() for k, v in twitter_saved['model_state'].items()}
    twitter_model.load_state_dict(state_dict)
    twitter_model.eval()
    print("✅ Twitter model loaded")
except Exception as e:
    twitter_model = None
    print(f"⚠️  Twitter model not loaded: {e}")
 
# 3. Flower classifier (.h5)
try:
    import tensorflow as tf
    flower_model = tf.keras.models.load_model('flowers_model.h5')
    FLOWER_CLASSES = ['daisy', 'rose', 'sunflower']
    print("✅ Flower model loaded")
except Exception as e:
    flower_model = None
    print(f"⚠️  Flower model not loaded: {e}")
 
 
# ─── Routes ────────────────────────────────────────────────────
@app.route('/')
def index():
    return render_template('index.html')
 
 
# 1. Agentic AI Chat
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message', '')
    history      = data.get('history', [])
    messages = history + [{"role": "user", "content": user_message}]
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages
    )
    reply = response.choices[0].message.content
    return jsonify({'reply': reply})
 
 
# 2. Twitter Sentiment
@app.route('/api/sentiment', methods=['POST'])
def sentiment():
    if twitter_model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    data = request.json
    text = data.get('text', '')
    inputs = twitter_tokenizer(
        text, return_tensors='pt',
        truncation=True, padding=True, max_length=128
    )
    with torch.no_grad():
        outputs = twitter_model(**inputs)
        pred    = torch.argmax(outputs.logits, dim=1).item()
    label = twitter_id2label[pred]
    return jsonify({'sentiment': label, 'text': text})
 
 
# 3. Flower Prediction
@app.route('/api/flower', methods=['POST'])
def flower():
    if flower_model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    file = request.files.get('image')
    if not file:
        return jsonify({'error': 'No image provided'}), 400
    img = Image.open(file.stream).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    preds      = flower_model.predict(img_array)
    pred_class = np.argmax(preds[0])
    confidence = float(preds[0][pred_class]) * 100
    return jsonify({
        'flower':     FLOWER_CLASSES[pred_class],
        'confidence': round(confidence, 2),
        'all_probs': {
            FLOWER_CLASSES[i]: round(float(preds[0][i]) * 100, 2)
            for i in range(3)
        }
    })
 
 
if __name__ == '__main__':
    app.run(debug=True, port=5000)