from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Union
from api.database.mongodb import MongoDB
from bson import ObjectId
from api.routes.auth import get_current_user

# Initialize router
router = APIRouter()

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Pydantic models for request validation
class Document(BaseModel):
    name: str
    uploaded: bool
    url: Optional[str] = None

class LicenseCreate(BaseModel):
    name: str
    type: str
    description: str
    status: str
    dueDate: datetime
    issuingAuthority: str
    cost: float
    documents: List[str]
    notes: Optional[str] = None
    eventId: str

class LicenseResponse(BaseModel):
    name: str
    type: str
    description: str
    status: str
    dueDate: datetime
    issuingAuthority: str
    cost: float
    documents: List[str]
    notes: Optional[str] = None
    eventId: str

    class Config:
        orm_mode = True

def serialize_license(license):
    if license:
        if "_id" in license:
            license["id"] = str(license["_id"])
            del license["_id"]
        return license
    return None

# Create a new license
@router.post("", response_model=dict[str, Union[bool, LicenseResponse]])
def create_license(license: LicenseCreate, user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        
        # Verify event exists and belongs to user
        event = db.events.find_one({
            "_id": ObjectId(license.eventId),
            "userId": user_id
        })
        
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found or you don't have permission to add licenses to it"
            )
        
        # Create license object
        license_data = license.dict()
        license_data["userId"] = user_id
        license_data["createdAt"] = datetime.now()
        
        # Insert into MongoDB
        result = db.licenses.insert_one(license_data)
        created_license = db.licenses.find_one({"_id": result.inserted_id})
        
        return {
            "success": True,
            "license": serialize_license(created_license)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create license: {str(e)}"
        )

# Create a new license for an event
@router.post("/{event_id}/licenses", response_model=dict[str, Union[bool, LicenseResponse]])
def create_event_license(event_id: str, license: LicenseCreate, user_id: str = Depends(get_current_user)):
    # Set the event ID in the license data
    license.eventId = event_id
    return create_license(license, user_id)

# Get all licenses for an event
@router.get("/{event_id}/licenses", response_model=dict[str, Union[bool, List[LicenseResponse]]])
def get_event_licenses(event_id: str, user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        
        # Verify event exists and belongs to user
        event = db.events.find_one({
            "_id": ObjectId(event_id),
            "userId": user_id
        })
        
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found or you don't have permission to view its licenses"
            )
        
        # Get all licenses for this event
        licenses = list(db.licenses.find({"eventId": event_id}))
        
        # Process and serialize each license
        processed_licenses = [serialize_license(license) for license in licenses]
        
        return {
            "success": True,
            "licenses": processed_licenses
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve licenses: {str(e)}"
        )

# Update a license
@router.put("/{license_id}", response_model=dict[str, Union[bool, LicenseResponse]])
def update_license(
    license_id: str,
    license_data: LicenseCreate,
    user_id: str = Depends(get_current_user)
):
    try:
        db = MongoDB.get_db()
        
        # Check if license exists and belongs to user's event
        existing_license = db.licenses.find_one({
            "_id": ObjectId(license_id),
            "userId": user_id
        })
        
        if not existing_license:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="License not found or you don't have permission to update it"
            )
        
        # Update the license
        update_data = license_data.dict()
        update_data["updatedAt"] = datetime.now()
        
        db.licenses.update_one(
            {"_id": ObjectId(license_id)},
            {"$set": update_data}
        )
        
        # Get updated license
        updated_license = db.licenses.find_one({"_id": ObjectId(license_id)})
        
        return {
            "success": True,
            "license": serialize_license(updated_license)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update license: {str(e)}"
        )

# Update a license by event_id
@router.put("/{event_id}/licenses/{license_id}", response_model=dict[str, Union[bool, LicenseResponse]])
def update_event_license(
    event_id: str,
    license_id: str,
    license_data: LicenseCreate,
    user_id: str = Depends(get_current_user)
):
    try:
        db = MongoDB.get_db()
        
        # Verify event exists and belongs to user
        event = db.events.find_one({
            "_id": ObjectId(event_id),
            "userId": user_id
        })
        
        if not event:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found or you don't have permission to update its licenses"
            )
        
        # Check if license exists and belongs to the event
        existing_license = db.licenses.find_one({
            "_id": ObjectId(license_id),
            "eventId": event_id,
            "userId": user_id
        })
        
        if not existing_license:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="License not found or it doesn't belong to the specified event"
            )
        
        # Update the license
        update_data = license_data.dict()
        update_data["updatedAt"] = datetime.now()
        
        db.licenses.update_one(
            {"_id": ObjectId(license_id)},
            {"$set": update_data}
        )
        
        # Get updated license
        updated_license = db.licenses.find_one({"_id": ObjectId(license_id)})
        
        return {
            "success": True,
            "license": serialize_license(updated_license)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update license: {str(e)}"
        )

# Delete a license
@router.delete("/{license_id}", response_model=dict)
def delete_license(license_id: str, user_id: str = Depends(get_current_user)):
    try:
        db = MongoDB.get_db()
        
        # Check if license exists and belongs to user's event
        existing_license = db.licenses.find_one({
            "_id": ObjectId(license_id),
            "userId": user_id
        })
        
        if not existing_license:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="License not found or you don't have permission to delete it"
            )
        
        # Delete the license
        db.licenses.delete_one({"_id": ObjectId(license_id)})
        
        return {
            "success": True,
            "message": "License deleted successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete license: {str(e)}"
        ) 