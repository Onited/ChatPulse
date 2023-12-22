from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient

app = FastAPI()
client = AsyncIOMotorClient('mongodb://localhost:27017')
db = client.mydatabase

@app.get("/")
async def read_root():
    return {"Hello": "World"}
