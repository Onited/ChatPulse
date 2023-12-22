from pydantic import BaseModel, EmailStr, Field
from typing import List

class User(BaseModel):
    id: str = Field(default=None, alias="_id")
    email: EmailStr
    pseudo: str
    friend_ids: List[str] = []
    friend_requests_pending: List[str] = []

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "pseudo": "user123",
                "friend_ids": ["userId1", "userId2"],
                "friend_requests_pending": ["userId3"]
            }
        }
