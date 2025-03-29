# pylint: disable-all
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..database.mongodb import MongoDB
from bson import ObjectId
from .auth import get_current_user

# Initialize router
router = APIRouter()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models for request validation
class EventCreate(BaseModel):
    eventName: str
    location: str
    dateTime: datetime
    attendees: int
    description: str

class EventResponse(BaseModel):
    id: str
    eventName: str
    location: str
    dateTime: datetime
    attendees: int
    description: str
    userId: str
    createdAt: datetime

    class Config:
        orm_mode = True

# Helper function to convert MongoDB ObjectId to string
def serialize_event(event):
    if event:
        event["id"] = str(event["_id"])
        del event["_id"]
        return event
    return None

# Create a new event
@router.post("", response_model=dict)
def create_event(event: EventCreate, user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        
        # Create event object
        event_data = {
            "userId": user_id,
            "eventName": event.eventName,
            "location": event.location,
            "dateTime": event.dateTime,
            "attendees": event.attendees,
            "description": event.description,
            "createdAt": datetime.now()
        }
        
        # Insert into MongoDB
        result = db.events.insert_one(event_data)
        
        # Get the created event
        created_event = db.events.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "event": serialize_event(created_event)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

# Get current user's events
@router.get("/user", response_model=dict)
def get_user_events(user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        
        # Find all events for this user and sort them by creation date
        user_events = list(db.events.find(
            {"userId": user_id},  # Use user_id directly, not as a dictionary key
            sort=[("createdAt", -1)]  # Sort by creation date, newest first
        ))
        
        # If no events found, return an empty list
        if not user_events:
            return {
                "success": True,
                "events": []
            }
        
        # Serialize each event in the list
        serialized_events = [serialize_event(event) for event in user_events]
            
        return {
            "success": True,
            "events": serialized_events
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve events: {str(e)}"
        )

# Update an existing event
@router.put("/{event_id}", response_model=dict)
def update_event(
    event_id: str, 
    event_data: EventCreate, 
    user_id: str = Depends(get_current_user)
):
    try:
        db = MongoDB.get_db()
        
        # Check if event exists and belongs to user
        existing_event = db.events.find_one({
            "_id": ObjectId(event_id),
            "userId": user_id
        })
        
        if not existing_event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found or you don't have permission to update it"
            )
        
        # Update the event
        update_data = {
            "eventName": event_data.eventName,
            "location": event_data.location,
            "dateTime": event_data.dateTime,
            "attendees": event_data.attendees,
            "description": event_data.description,
            "updatedAt": datetime.now()
        }
        
        db.events.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": update_data}
        )
        
        # Get updated event
        updated_event = db.events.find_one({"_id": ObjectId(event_id)})
        
        return {
            "success": True,
            "event": serialize_event(updated_event)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update event: {str(e)}"
        )