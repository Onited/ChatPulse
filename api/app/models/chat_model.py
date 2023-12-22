from pydantic import BaseModel, Field
from typing import List

class Chat(BaseModel):
    id: str = Field(default=None, alias="_id")
    participant_ids: List[str]

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "participant_ids": ["userId1", "userId2"]
            }
        }
