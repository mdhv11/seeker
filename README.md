# Seeker: Multimodal Chatbot with Gemma 3 Integration

## Overview

Seeker is a full-stack application that enables users to interact with Google's Gemma 3 large language model (LLM) via a chat interface. Users can send both text and image inputs, and receive intelligent, context-aware responses. The backend leverages HuggingFace Transformers and Flask, while the frontend is built with React, Material-UI, and Tailwind CSS.

## Features

- **Chat with LLM**: Send text and images to the Gemma 3 model and receive responses in real time.
- **Image Upload**: Upload images as part of your message for multimodal interaction.
- **Conversation History**: Maintains context for more coherent conversations.
- **Theme Support**: Toggle between light and dark modes.
- **Clear Chat & Timestamps**: Clear chat history and toggle message timestamps.
- **Docker Support**: Easily run the backend in a containerized environment.

## Architecture

- **Backend**: Python, Flask, HuggingFace Transformers, Gemma 3 model, Torch, CORS, dotenv.
- **Frontend**: React, Material-UI (MUI), Tailwind CSS, Axios, Vite.

```
[User] ⇄ [React Frontend] ⇄ [Flask API] ⇄ [Gemma 3 Model]
```

## Setup Instructions

### 1. Backend

#### Prerequisites

- Python 3.10+
- (Optional) Docker
- HuggingFace account and access token for Gemma 3

#### Installation

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` file in the `Backend` directory:

```
HF_TOKEN=your_huggingface_token_here
```

#### Running the Backend

```bash
python app.py
```

The backend will start on `http://localhost:8080`.

#### Docker (Optional)

To build and run the backend with Docker:

```bash
cd Backend
docker build -t seeker-backend .
docker run -p 8080:8080 --env-file .env seeker-backend
```

### 2. Frontend

#### Prerequisites

- Node.js 18+
- npm or yarn

#### Installation

```bash
cd seeker-chat
npm install
# or
yarn install
```

#### Running the Frontend

```bash
npm run dev
# or
yarn dev
```

The frontend will start on `http://localhost:5173` (default Vite port).

## Usage

- Open the frontend in your browser.
- Type a message and/or upload an image.
- Send your message and view the model's response in the chat interface.

## Main Dependencies

### Backend

- Flask
- flask-cors
- transformers (HuggingFace)
- torch
- pillow
- python-dotenv
- bitsandbytes (for quantization, optional)

### Frontend

- React
- @mui/material (Material-UI)
- Tailwind CSS
- Axios
- Vite

## Third-Party Licenses

This project uses open-source packages. Below are the main dependencies and their licenses:

| Package       | License      |
| ------------- | ------------ |
| Flask         | BSD-3-Clause |
| flask-cors    | MIT          |
| transformers  | Apache-2.0   |
| torch         | BSD          |
| pillow        | HPND         |
| python-dotenv | BSD-3-Clause |
| bitsandbytes  | MIT          |
| React         | MIT          |
| @mui/material | MIT          |
| Tailwind CSS  | MIT          |
| Axios         | MIT          |
| Vite          | MIT          |

For a full list of licenses, see the respective package documentation or the `requirements.txt` and `package.json` files.

---

> **Note:** This project does not include a license for the original code. Please ensure you comply with the licenses of all third-party dependencies if you distribute or modify this project.
