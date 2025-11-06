from typing import Union
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, HttpUrl
import unicodedata
import re
import json
from pathlib import Path
import os
import random

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Women in Tech Wordle")
file_path = os.path.join('data', 'women-in-tech.json')

with open(file_path, "r") as f:
    data = json.load(f)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Woman(BaseModel):
  id: str
  name: str
  bio: str
  link: HttpUrl
  funFact: str | None  = None
  quote: str | None = None


@app.get('/women')
def read_women():
   return data

@app.get('/women/get-random-id')
def find_word_of_the_day():
   max_length = len(data)
   randomNumber = random.randint(0, max_length-1)
   return randomNumber

@app.get('/women/{women_id}')
def get_woman_information(women_id: int):
   if women_id < 0 or women_id > len(data)-1:
      raise HTTPException(404, "Women Not Found")
   return data[women_id]
   

