from fastapi import FastAPI
from pymongo import MongoClient
import os
import google.generativeai as genai
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# MongoDB Atlas connection setup
connection_string = os.getenv('MONGODB_URI')
client = MongoClient(connection_string)
db = client['interview']
collection = db['aicontents']

# Google Gemini API client setup
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate_content():
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content("Generate some content for my site")
    content = response.text.strip()
    collection.insert_one({'content': content, 'timestamp': datetime.now()})
    return {"content": content}

@app.get("/history")
async def get_history():
    contents = list(collection.find({}, {'_id': 0, 'content': 1, 'timestamp': 1}))
    return {"history": contents}

if __name__ == '__main__': import uvicorn; uvicorn.run(app, host="0.0.0.0", port=8000)
