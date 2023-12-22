from pydantic import BaseModel, Field
from datetime import datetime

class Message(BaseModel):
    id: str = Field(default=None, alias="_id")
    sender_id: str
    chat_id: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "sender_id": "userId1",
                "chat_id": "chatId1",
                "content": "Hello, World!"
            }
        }
