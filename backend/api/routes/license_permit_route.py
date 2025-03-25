from datetime import datetime
from typing import List, Dict, Any

from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from bson import ObjectId
from backend.api.database.mongodb import MongoDB
from backend.api.routes.auth import get_current_user

router = APIRouter()

# Models
class License(BaseModel):
    """Model representing an event license with its details and validity period."""
    name: str
    type: str
    issued_by: str
    issue_date: datetime
    expiry_date: datetime
    status: str

class Permit(BaseModel):
    """Model representing an event permit with its details and validity period."""
    name: str
    type: str
    issued_by: str
    issue_date: datetime
    expiry_date: datetime
    status: str

# Helper function to access the collection
def get_license_permit_collection():
    collection = MongoDB.client.eventflow_db.event_licenses_permits
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB collection not found")
    return collection

# Helper to verify event access
def verify_event_access(event_id: str, user_id: str) -> bool:
    if not ObjectId.is_valid(event_id):
        return False
    
    events_collection = MongoDB.client.eventflow_db.events
    event = events_collection.find_one({"_id": ObjectId(event_id)})
    
    if not event:
        return False
    
    return True

# Ensure event document exists
def ensure_event_licenses_permits_exists(event_id: str, user_id: str) -> Dict[str, Any]:
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
    
    if not verify_event_access(event_id, user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this event"
        )
    
    event_data = get_license_permit_collection().find_one({"event_id": ObjectId(event_id)})
    
    if not event_data:
        default_data = {
            "event_id": ObjectId(event_id),
            "user_id": user_id,
            "licenses": [],
            "permits": [],
            "summary": {
                "license_count": 0,
                "permit_count": 0,
                "last_updated": datetime.utcnow()
            }
        }
        get_license_permit_collection().insert_one(default_data)
        event_data = get_license_permit_collection().find_one({"event_id": ObjectId(event_id)})
    
    return event_data

# Routes
@router.get("/{event_id}/licenses", response_model=List[License])
def get_licenses(event_id: str, user_id: str = Depends(get_current_user)):
    """Get all licenses for an event"""
    event_data = ensure_event_licenses_permits_exists(event_id, user_id)
    return event_data.get("licenses", [])

@router.post("/{event_id}/licenses")
def create_license(event_id: str, license: License, user_id: str = Depends(get_current_user)):
    """Add a new license to an event"""
    ensure_event_licenses_permits_exists(event_id, user_id)
    
    license_dict = license.dict()
    
    get_license_permit_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$push": {"licenses": license_dict}, "$inc": {"summary.license_count": 1}, "$set": {"summary.last_updated": datetime.utcnow()}}
    )
    
    return license_dict

@router.delete("/{event_id}/licenses/{license_index}")
def delete_license(event_id: str, license_index: int, user_id: str = Depends(get_current_user)):
    """Delete a license by index"""
    event_data = ensure_event_licenses_permits_exists(event_id, user_id)
    
    if "licenses" not in event_data or len(event_data["licenses"]) <= license_index:
        raise HTTPException(status_code=404, detail="License not found")
    
    license_to_remove = event_data["licenses"][license_index]
    
    get_license_permit_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$pull": {"licenses": {"$eq": license_to_remove}}, "$inc": {"summary.license_count": -1}, "$set": {"summary.last_updated": datetime.utcnow()}}
    )
    
    return {"detail": "License deleted successfully"}

@router.get("/{event_id}/permits", response_model=List[Permit])
def get_permits(event_id: str, user_id: str = Depends(get_current_user)):
    """Get all permits for an event"""
    event_data = ensure_event_licenses_permits_exists(event_id, user_id)
    return event_data.get("permits", [])

@router.post("/{event_id}/permits")
def create_permit(event_id: str, permit: Permit, user_id: str = Depends(get_current_user)):
    """Add a new permit to an event"""
    ensure_event_licenses_permits_exists(event_id, user_id)
    
    permit_dict = permit.dict()
    
    get_license_permit_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$push": {"permits": permit_dict}, "$inc": {"summary.permit_count": 1}, "$set": {"summary.last_updated": datetime.utcnow()}}
    )
    
    return permit_dict

@router.delete("/{event_id}/permits/{permit_index}")
def delete_permit(event_id: str, permit_index: int, user_id: str = Depends(get_current_user)):
    """Delete a permit by index"""
    event_data = ensure_event_licenses_permits_exists(event_id, user_id)
    
    if "permits" not in event_data or len(event_data["permits"]) <= permit_index:
        raise HTTPException(status_code=404, detail="Permit not found")
    
    permit_to_remove = event_data["permits"][permit_index]
    
    get_license_permit_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$pull": {"permits": {"$eq": permit_to_remove}}, "$inc": {"summary.permit_count": -1}, "$set": {"summary.last_updated": datetime.utcnow()}}
    )
    
    return {"detail": "Permit deleted successfully"}
