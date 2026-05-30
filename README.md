# 🤖 AI Studio — Integrated Artificial Intelligence Web Application

<div align="center">

![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.1-black?style=for-the-badge&logo=flask)
![PyTorch](https://img.shields.io/badge/PyTorch-2.x-red?style=for-the-badge&logo=pytorch)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.21-orange?style=for-the-badge&logo=tensorflow)
![Groq](https://img.shields.io/badge/Groq-LLaMA_3.3_70B-purple?style=for-the-badge)

**A full-stack AI web application integrating three independent AI/ML models into a single modern interface.**

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Architecture](#-architecture)
- [Modules](#-modules)
  - [Module 1 — Agentic AI](#module-1--agentic-ai-conversational-chatbot)
  - [Module 2 — ML / NLP](#module-2--machine-learning--nlp-sentiment-analysis)
  - [Module 3 — Deep Learning](#module-3--deep-learning-flower-classification)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Running the Application](#-running-the-application)
- [Model Details](#-model-details)
- [Results & Performance](#-results--performance)
- [Dataset Information](#-dataset-information)
- [Challenges & Solutions](#-challenges--solutions)
- [License](#-license)

---

## 🌟 Project Overview

**AI Studio** is a comprehensive artificial intelligence project developed as part of an academic AI course. The project demonstrates the practical application of three distinct AI paradigms — Agentic AI, Machine Learning with Natural Language Processing, and Deep Learning with Computer Vision — all unified within a single responsive web application.

The application allows users to:
- **Chat** with a powerful large language model (LLaMA 3.3 70B via Groq API)
- **Analyze** the sentiment of any text or tweet (Positive / Negative / Neutral)
- **Identify** flower species from uploaded images (Daisy / Rose / Sunflower)

All three modules run simultaneously from a single Flask server, with pre-trained model files loaded at startup for instant inference.

---

## 🚀 Live Demo

To run the application locally:

```bash
# Clone or extract the project
cd ai-website

# Install dependencies
pip install flask flask-cors groq transformers torch tensorflow pillow numpy

# Start the server
python app.py
```

Then open your browser and navigate to:
```
http://localhost:5000
```

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🤖 **Agentic AI Chatbot** | Real-time conversational AI powered by LLaMA 3.3 70B — supports English and Urdu |
| 💬 **Sentiment Analysis** | Classifies any text into Positive, Negative, or Neutral with 95.83% accuracy |
| 🌸 **Flower Classifier** | Identifies flower species from images using DenseNet121 with 80% accuracy |
| 🌙 **Dark Theme UI** | Modern dark interface with lime-green accents and smooth animations |
| 📱 **Responsive Design** | Clean sidebar navigation with three dedicated pages |
| ⚡ **Real-time Inference** | All models loaded at startup for instant predictions |
| 📊 **Confidence Scores** | Flower classifier displays per-class probability bars |
| 🔄 **Chat History** | Agentic AI maintains conversation context across messages |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Browser)                    │
│         HTML + CSS + Vanilla JavaScript                  │
│  ┌──────────────┬──────────────────┬──────────────────┐ │
│  │  Agentic AI  │  Sentiment Page  │  Flower AI Page  │ │
│  │  (Chat UI)   │  (Text Input)    │  (Image Upload)  │ │
│  └──────┬───────┴────────┬─────────┴────────┬─────────┘ │
└─────────┼────────────────┼──────────────────┼───────────┘
          │ /api/chat      │ /api/sentiment    │ /api/flower
          ▼                ▼                   ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Flask Server)                  │
│                      app.py                              │
│  ┌──────────────┬──────────────────┬──────────────────┐ │
│  │  Groq API    │  DistilBERT      │  DenseNet121     │ │
│  │  (LLaMA 3.3) │  (.pkl model)    │  (.h5 model)     │ │
│  └──────────────┴──────────────────┴──────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Modules

### Module 1 — Agentic AI (Conversational Chatbot)

The Agentic AI module provides a real-time conversational interface powered by **Meta's LLaMA 3.3 70B** model, accessed via the **Groq API**.

**Key Details:**
- **Model:** LLaMA 3.3 70B Versatile
- **API Provider:** Groq (free tier)
- **Language Support:** English and Urdu
- **Context Window:** Last 10 messages maintained for coherent conversation
- **Response Time:** < 2 seconds average

**API Endpoint:**
```
POST /api/chat
Body: { "message": "Your question here", "history": [...] }
Returns: { "reply": "AI response" }
```

---

### Module 2 — Machine Learning / NLP (Sentiment Analysis)

A fine-tuned **DistilBERT** model trained on Twitter data to classify text sentiment into three categories.

**Key Details:**
- **Base Model:** distilbert-base-uncased (HuggingFace)
- **Task:** Multi-class text classification (3 classes)
- **Classes:** Positive, Negative, Neutral
- **Training Accuracy:** 95.83%
- **Training Framework:** PyTorch
- **Saved Format:** `.pkl` file

**API Endpoint:**
```
POST /api/sentiment
Body: { "text": "I love this product!" }
Returns: { "sentiment": "Positive", "text": "..." }
```

---

### Module 3 — Deep Learning (Flower Classification)

A **DenseNet121** convolutional neural network fine-tuned on flower images using transfer learning and K-Fold cross-validation.

**Key Details:**
- **Best Model:** DenseNet121 (selected from VGG16, ResNet50, DenseNet121)
- **Task:** Multi-class image classification (3 classes)
- **Classes:** Daisy, Rose, Sunflower
- **Test Accuracy:** 80.00%
- **Training Framework:** TensorFlow / Keras
- **Saved Format:** `.h5` file

**API Endpoint:**
```
POST /api/flower
Body: multipart/form-data with "image" field
Returns: { "flower": "rose", "confidence": 94.5, "all_probs": {...} }
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Python | 3.12 | Core language |
| Flask | 3.1 | Web server & API |
| Flask-CORS | 6.0 | Cross-origin requests |
| PyTorch | 2.x | ML model inference |
| TensorFlow | 2.21 | Deep learning inference |
| Transformers | 5.x | DistilBERT tokenizer & model |
| Groq | 1.x | LLaMA API client |
| Pillow | 12.x | Image preprocessing |
| NumPy | 2.x | Array operations |

### Frontend
| Technology | Purpose |
|-----------|---------|
| HTML5 | Page structure |
| CSS3 | Styling & animations |
| Vanilla JavaScript | API calls & DOM manipulation |
| Google Fonts (Syne + DM Mono) | Typography |

### Training Environment
| Tool | Purpose |
|------|---------|
| Google Colab (T4 GPU) | Model training |
| Google Drive | Dataset & model storage |
| Kaggle | Dataset download |

---

## 📁 Project Structure

```
ai-website/
│
├── app.py                      # Flask backend — main server file
├── requirements.txt            # Python dependencies
├── twitter_model_cpu.pkl       # Trained DistilBERT sentiment model (CPU)
├── flowers_model.h5            # Trained DenseNet121 flower model
│
├── templates/
│   └── index.html              # Single-page HTML application
│
└── static/
    ├── style.css               # Dark theme CSS styling
    └── script.js               # Frontend JavaScript logic
```

---

## ⚙️ Installation & Setup

### Prerequisites

Ensure the following are installed on your system:

- Python 3.10 or higher
- pip (Python package manager)
- Git (optional)

### Step 1 — Clone or Extract the Project

```bash
# If using Git
git clone <repository-url>
cd ai-website

# Or extract the ZIP file and navigate into it
cd ai-website
```

### Step 2 — Install Dependencies

```bash
pip install flask flask-cors groq transformers torch tensorflow pillow numpy
```

> ⚠️ **Note:** TensorFlow and PyTorch are large packages. Installation may take 5–10 minutes depending on your internet speed.

### Step 3 — Verify Model Files

Ensure the following model files are present in the project root:

```
✅ twitter_model_cpu.pkl    (~256 MB)
✅ flowers_model.h5         (~30 MB)
```

> **Important:** Use `twitter_model_cpu.pkl` (not `twitter_model.pkl`). The original model was trained on GPU (Colab) and must be converted for CPU inference on local machines.

>  ⚠️ Model Files

Due to GitHub file size limits, model files are not included:
- `twitter_model_cpu.pkl` (~256 MB)
- `flowers_model.h5` (~30 MB)

Download from Google Drive: [https://drive.google.com/drive/folders/1hFx8-SeZAiN1XLnwraNgEmTQUzNdfH-Z?usp=sharing]

### Step 4 — Configure API Key (Optional)

The Groq API key is pre-configured in `app.py`. To use your own key:

1. Visit [console.groq.com](https://console.groq.com)
2. Create a free account and generate an API key
3. Replace the key in `app.py`:

```python
groq_client = Groq(api_key="YOUR_GROQ_API_KEY_HERE")
```

---

## ▶️ Running the Application

```bash
# Navigate to the project folder
cd ai-website

# Start the Flask server
python app.py
```

**Expected output:**
```
✅ Twitter model loaded
✅ Flower model loaded
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

Open your browser and go to:
```
http://localhost:5000
```

---

## 🧠 Model Details

### DistilBERT Sentiment Model

```
Architecture:    DistilBertForSequenceClassification
Base Model:      distilbert-base-uncased
Parameters:      ~66 million
Input:           Text (max 128 tokens)
Output:          3-class probability distribution
Training Data:   Twitter Entity Sentiment (600 samples)
Optimizer:       AdamW (lr=2e-5)
Epochs:          3
Batch Size:      16
```

### DenseNet121 Flower Model

```
Architecture:    DenseNet121 (ImageNet pre-trained)
Top Layers:      GlobalAveragePooling2D → Dropout(0.3) → Dense(128) → Dropout(0.2) → Dense(3, softmax)
Input:           224 × 224 × 3 RGB images
Output:          3-class probability distribution
Training Data:   Flowers Recognition (600 images)
Optimizer:       Adam (lr=2e-5)
Max Epochs:      10 (with EarlyStopping patience=3)
Batch Size:      8
Cross-Validation: 3-Fold KFold
```

---

## 📊 Results & Performance

### Sentiment Analysis (DistilBERT)

| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| Negative | 0.95 | 0.93 | 0.94 | 40 |
| Neutral | 0.95 | 0.97 | 0.96 | 40 |
| Positive | 0.97 | 0.97 | 0.97 | 40 |
| **Overall** | **0.96** | **0.96** | **0.96** | **120** |

**Final Test Accuracy: 95.83%**

### Flower Classification (DenseNet121)

| Model | Average CV Accuracy |
|-------|-------------------|
| DenseNet121 | **76.17%** ✅ Best |
| VGG16 | 55.17% |
| ResNet50 | 35.83% |

| Class | Precision | Recall | F1-Score | Support |
|-------|-----------|--------|----------|---------|
| Daisy | 0.83 | 0.75 | 0.79 | 20 |
| Rose | 0.76 | 0.95 | 0.84 | 20 |
| Sunflower | 0.82 | 0.70 | 0.76 | 20 |
| **Overall** | **0.81** | **0.80** | **0.80** | **60** |

**Final Test Accuracy: 80.00%**

---

## 📂 Dataset Information

### Twitter Sentiment Dataset
| Property | Value |
|----------|-------|
| Source | Kaggle — Twitter Entity Sentiment Analysis |
| File | twitter_training.csv |
| Original Classes | Positive, Negative, Neutral, Irrelevant |
| Classes Used | Positive, Negative, Neutral (3 classes) |
| Samples Used | 200 per class = 600 total |
| Train / Test Split | 80% / 20% |

### Flowers Recognition Dataset
| Property | Value |
|----------|-------|
| Source | Kaggle — Flowers Recognition |
| Original Classes | Rose, Daisy, Sunflower, Tulip, Dandelion |
| Classes Used | Rose, Daisy, Sunflower (3 classes) |
| Images Used | 200 per class = 600 total |
| Image Size | 224 × 224 pixels |

---

## ⚡ Challenges & Solutions

| Challenge | Root Cause | Solution |
|-----------|-----------|----------|
| Gemini API returning 429 error | Free tier quota exhausted (limit: 0) | Switched to Groq API with LLaMA 3.3 70B |
| BART model causing RAM crash on Colab | Model size 400MB+ too large for free tier | Replaced with DistilBERT (66M params, 6× smaller) |
| Colab crash during Deep Learning training | 5 models × 5 folds × 10 epochs exceeded 12GB RAM | Reduced to 3 models, 3 folds, 200 images/class |
| Twitter model failing to load on Windows | Model saved with CUDA tensors on Colab GPU | Implemented CPU_Unpickler to force CPU deserialization |
| Flower model accuracy low initially | Very small dataset (200 images) | Applied data augmentation (rotation, flip, shift) |

---

## 📝 License

This project was developed for academic purposes as part of an Artificial Intelligence course.

---

<div align="center">

**Built with ❤️ using Python · Flask · PyTorch · TensorFlow · Groq**

</div>
