# 🌟 Women in Tech Wordle

A daily Wordle-style guessing game that celebrates pioneering women in technology — inventors, founders, engineers, scientists, and innovators whose contributions shaped the world of computing.

Built with a **React frontend** and a **FastAPI backend**, this project delivers a clean, modern, educational experience.  
The UI was initially generated using **Figma AI** and refined manually.

It is deployed using Vercel and Render [women-in-tech-wordle.vercel.app](women-in-tech-wordle.vercel.app)

---

## ✨ Features

- 🎯 **Daily Woman in Tech** — A new figure appears each day, sourced from the backend.
- 🔠 **Wordle-Style Gameplay** — Guess the name and receive letter-by-letter feedback.
- 🧠 **Clues & Fun Facts** — Each figure includes a short bio, a quote, and hints.
- ⚡ **FastAPI Backend** — Handles daily rotation and structured metadata.
- 🎨 **Modern React UI** — Clean, responsive, and approachable.
- 🌍 **Educational Focus** — Designed to promote diversity and representation.

---

## 🧱 Tech Stack

### **Frontend**
- React  
- TypeScript  
- Vite  
- CSS / Tailwind 

### **Backend**
- Python  
- FastAPI  

---

## 📂 Project Structure
```
women-in-tech-wordle/
│
├── backend/
│   ├── main.py
│   ├── routers/
│   ├── data/
│   └── ...
│
└── frontend/
    ├── src/
    ├── components/
    ├── assets/
    └── ...
```
---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/shailikadakia/women-in-tech-wordle
cd women-in-tech-wordle
```

### 2. Run the backend
```sh 
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend will run at:
```http://localhost:8000```

### 3. Run the frontend
```sh
cd frontend
npm install
npm run dev
```
---
## 💡 Why This Project?

Representation matters.
This project makes learning about the contributions of women in technology interactive, fun, and accessible — inspiring users while celebrating innovators often left out of mainstream tech history.
