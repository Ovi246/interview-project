from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import os
import google.generativeai as genai
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import logging
import requests
import base64

load_dotenv()

app = FastAPI()

# MongoDB Atlas connection setup
connection_string = os.getenv('MONGODB_URI')
client = MongoClient(connection_string)
db = client['interview']
collection = db['aicontents']

# Google Gemini API client setup
genai.configure(api_key=os.environ["GEMINI_API_KEY"])
model = genai.GenerativeModel('gemini-1.5-flash')

# Basic logging setup 
logging.basicConfig(level=logging.INFO) 
logger = logging.getLogger(__name__)

API_KEY = os.getenv('HUGGINGFACE_API_KEY')
API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev" 
headers = {"Authorization": f"Bearer {API_KEY}"} 

def generate_image_huggingface(prompt): 
    payload = { "inputs": prompt } 
    response = requests.post(API_URL, headers=headers, json=payload) 

    logging.info(f"Response status code: {response.status_code}") 
    logging.info(f"Response content length: {len(response.content)}") 
    try: 
        image_bytes = response.content 
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        return f"data:image/png;base64,{base64_image}"

    except Exception as e: 
        logging.error(f"Error processing image: {e}") 
    raise HTTPException(status_code=500, detail="Failed to generate image")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate(request: Request):
    data = await request.json()
    user_id = data.get("user_id")
    topic = data.get("topic")
    pages = data.get("pages")
    if not user_id or not topic or not pages: 
        raise HTTPException(status_code=400, detail="User ID, topic, and number of pages are required")

    story_structure = []
    for i in range(pages):
        segment_text = f"Generate a story about {topic}, segment {i+1}, about 500 words"
        response = model.generate_content(segment_text)
        logger.info(f"Response from generate: {response}") 
        text = response._result.candidates[0].content.parts[0].text.strip()

        image_prompt = f"Illustration for story about {topic}, segment {i+1}"
        image_base64 = generate_image_huggingface(image_prompt)
        logger.info(f"Generated image base64 length: {len(image_base64)}")

        story_structure.append({
            "segment_id": i + 1,
            "text": text,
            "image": image_base64
        })

    story_data = {
        "user_id": user_id,  
        "topic": topic,
        "segments": story_structure,
        "timestamp": datetime.now()
    }

    # Store in MongoDB
    story_id = collection.insert_one(story_data).inserted_id

    return JSONResponse(content={
        "story_id": str(story_id),
        "topic": topic,
        "pages": [
            {
                "number": segment["segment_id"],
                "content": segment["text"],
                "image": segment["image"]
            } for segment in story_structure
        ]
    })

@app.get("/history/{user_id}") 
async def get_history(user_id: str): 
    stories = list(collection.find({"user_id": user_id}, {'_id': 1, 'topic': 1, 'timestamp': 1}))
    return JSONResponse(content={
        "history": [
            {
                "id": str(story['_id']),
                "topic": story['topic'],
                "timestamp": story['timestamp'].isoformat()
            } for story in stories
        ]
    })

@app.get("/story/{story_id}")
async def get_story(story_id: str):
    from bson import ObjectId
    story = collection.find_one({"_id": ObjectId(story_id)})
    if not story:
        raise HTTPException(status_code=404, detail="Story not found")
    
    return JSONResponse(content={
        "story_id": str(story['_id']),
        "topic": story['topic'],
        "pages": [
            {
                "number": segment["segment_id"],
                "content": segment["text"],
                "image": segment["image"]
            } for segment in story['segments']
        ],
        "timestamp": story['timestamp'].isoformat()
    })

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
