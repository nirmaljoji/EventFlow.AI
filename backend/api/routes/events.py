from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime, timedelta
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
    endDate: Optional[datetime] = None
    attendees: int
    description: str
    sustainable: bool

class EventResponse(BaseModel):
    id: str
    eventName: str
    location: str
    dateTime: datetime
    endDate: datetime
    attendees: int
    description: str
    userId: str
    createdAt: datetime

    class Config:
        orm_mode = True

# Utility functions for event processing
def process_event_dates(event):
    """Process event dates to ensure both dateTime and endDate are set properly"""
    if event:
        event_date = event.get("dateTime")
        end_date = event.get("endDate")
        
        # Default event duration of 1 day if no end date specified
        if not end_date and event_date:
            event["endDate"] = event_date + timedelta(days=1)
    
    return event

# Helper function to convert MongoDB ObjectId to string
def serialize_event(event):
    if event:
        # Process dates first
        event = process_event_dates(event)
        
        # Check if _id exists, if not, use a generated ID or any other existing ID
        if "_id" in event:
            event["id"] = str(event["_id"])
            del event["_id"]
        elif "id" not in event:
            # If neither _id nor id exists, generate a placeholder ID
            event["id"] = str(ObjectId())
        return event
    return None

# Create a new event
@router.post("", response_model=dict)
def create_event(event: EventCreate, user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        
        # Ensure event has an end date (default to 1 day after start if not provided)
        end_date = event.endDate
        if not end_date:
            end_date = event.dateTime + timedelta(days=1)
        
        # Create event object
        event_data = {
            "userId": user_id,
            "eventName": event.eventName,
            "location": event.location,
            "dateTime": event.dateTime,
            "endDate": end_date,
            "attendees": event.attendees,
            "description": event.description,
            "sustainable": event.sustainable,
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
        import traceback
        error_details = traceback.format_exc()
        print(f"Create event error: {error_details}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create event: {str(e)}"
        )

# Get current user's events
@router.get("/user", response_model=dict)
def get_user_events(user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        current_date = datetime.now()
        
        # Find all events for this user and sort them by creation date
        user_events = list(db.events.find(
            {"userId": user_id},
            sort=[("createdAt", -1)]
        ))
        
        # If no events found, return an empty list
        if not user_events:
            return {
                "success": True,
                "events": []
            }
        
        # Process and serialize each event
        processed_events = []
        for event in user_events:
            event = process_event_dates(event)
            serialized = serialize_event(event)
            
            # Add type if not present
            if "type" not in serialized:
                serialized["type"] = "Conference"  # Default type
                
            processed_events.append(serialized)
            
        return {
            "success": True,
            "events": processed_events
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
        
        # Ensure event has an end date (default to 1 day after start if not provided)
        end_date = event_data.endDate
        if not end_date:
            end_date = event_data.dateTime + timedelta(days=1)
        
        # Update the event
        update_data = {
            "eventName": event_data.eventName,
            "location": event_data.location,
            "dateTime": event_data.dateTime,
            "endDate": end_date,
            "attendees": event_data.attendees,
            "description": event_data.description,
            "sustainable": event_data.sustainable,
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
        import traceback
        error_details = traceback.format_exc()
        print(f"Update event error: {error_details}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update event: {str(e)}"
        )


# Get dashboard data (combined endpoint for all dashboard components)
@router.get("/dashboard", response_model=dict)
def get_dashboard_data(user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        current_date = datetime.now()
        
        # Get all user events
        all_events = list(db.events.find({"userId": user_id}))
        
        # Calculate stats
        total_events = len(all_events)
        
        ongoing_events = []
        upcoming_events = []
        past_events = []
        
        # Categorize events
        for event in all_events:
            # Process dates to ensure endDate is set
            event = process_event_dates(event)
            event_date = event.get("dateTime")
            end_date = event.get("endDate")
            
            if event_date and end_date:
                if event_date <= current_date and end_date >= current_date:
                    ongoing_events.append(event)
                elif event_date > current_date:
                    upcoming_events.append(event)
                elif end_date < current_date:
                    past_events.append(event)
        
        # Sort events
        if ongoing_events:
            ongoing_events.sort(key=lambda x: x.get("dateTime"))
        if upcoming_events:
            upcoming_events.sort(key=lambda x: x.get("dateTime"))
        if past_events:
            past_events.sort(key=lambda x: x.get("dateTime", datetime.now()), reverse=True)
        
        # Serialize events first to ensure they all have proper IDs
        serialized_ongoing = [serialize_event(event) for event in ongoing_events]
        serialized_upcoming = [serialize_event(event) for event in upcoming_events]
        serialized_past = [serialize_event(event) for event in past_events]
        
        # Get timeline events from the already serialized events
        # Combine serialized ongoing and upcoming events
        combined_events = serialized_ongoing + serialized_upcoming
        # Sort by dateTime
        timeline_events = sorted(combined_events, key=lambda x: x.get("dateTime", datetime.now()))[:5]
        
        return {
            "success": True,
            "stats": {
                "total": total_events,
                "ongoing": len(ongoing_events),
                "upcoming": len(upcoming_events),
                "completed": len(past_events)
            },
            "events": {
                "ongoing": serialized_ongoing,
                "upcoming": serialized_upcoming,
                "past": serialized_past,
                "timeline": timeline_events
            }
        }
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Dashboard error: {error_details}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve dashboard data: {str(e)}"
        )

# Get a single event by ID
@router.get("/{event_id}", response_model=dict)
def get_event(event_id: str, user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        
        # Find event by ID and user
        event = db.events.find_one({
            "_id": ObjectId(event_id),
            "userId": user_id
        })
        
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Process and serialize event
        event = process_event_dates(event)
        serialized = serialize_event(event)
        
        # Add type if not present
        if "type" not in serialized:
            serialized["type"] = "Conference"
            
        return {
            "success": True,
            "event": serialized
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve event: {str(e)}"
        )