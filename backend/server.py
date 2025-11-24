from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware

import json
from pathlib import Path
import os
import random
from datetime import datetime, timezone

class Woman(BaseModel):
    id: str
    name: str
    bio: str
    link: HttpUrl
    funFact: str | None = None
    quote: str | None = None

app = FastAPI(title="Women in Tech Wordle")

# Use a path relative to this file, not the working dir
BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "women-in-tech.json"
DATA = json.loads(DATA_PATH.read_text(encoding="utf-8"))
START_DATE = datetime(2025, 1, 1, tzinfo=timezone.utc)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://women-in-tech-wordle.vercel.app/"
        "https://women-in-tech-wordle.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/women")
def read_women():
    return DATA

@app.get("/women/get-random-id")
def find_word_of_the_day():
    max_length = len(DATA)
    randomNumber = random.randint(0, max_length - 1)
    return randomNumber

@app.get("/women/{women_id}")
def get_woman_information(women_id: int):
    if women_id < 0 or women_id > len(DATA) - 1:
        raise HTTPException(404, "Woman Not Found")
    return DATA[women_id]

def daily_index(today_utc: datetime) -> int:
    today_utc = today_utc.replace(hour=0, minute=0, second=0, microsecond=0)
    diff_days = (today_utc - START_DATE).days
    return diff_days % len(DATA)

@app.get("/daily")
def get_daily():
    now = datetime.now(timezone.utc)
    idx = daily_index(now)
    woman = DATA[idx]
    target = woman["name"].replace(" ", "")
    return {
        "date": now.date().isoformat(),
        "index": idx,
        "woman": woman,
        "target": target,
        "length": len(target),
    }
