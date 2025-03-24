from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Dict, Any
from pydantic import BaseModel, Field
from bson import ObjectId
from datetime import datetime
from ..database.mongodb import MongoDB
from .auth import get_current_user

router = APIRouter()

# Models
class MenuItem(BaseModel):
    name: str
    type: str
    dietary: str
    status: str

class Beverage(BaseModel):
    name: str
    category: str
    serving: str
    status: str

class Vendor(BaseModel):
    name: str
    type: str
    contact: str
    phone: str
    status: str
    progress: int

class FoodSummary(BaseModel):
    budget: float
    budget_percentage: int
    vendor_count: int
    vendor_status: str
    menu_item_count: int
    dietary_options_count: int
    status: str
    last_updated: datetime = Field(default_factory=datetime.utcnow)

# Helper function to access the collection
def get_food_collection():
    collection = MongoDB.client.eventflow_db.event_food
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB collection not found")
    return collection

# Helper to validate user has access to event
def verify_event_access(event_id: str, user_id: str) -> bool:
    if not ObjectId.is_valid(event_id):
        return False
    
    events_collection = MongoDB.client.eventflow_db.events
    event = events_collection.find_one({"_id": ObjectId(event_id)})
    
    if not event:
        return False
    
    # implement after fixing user_id
    # # Check if current user is the creator of the event
    # event_user_id = str(event.get("user_id", ""))
    # if event_user_id != user_id and str(event.get("created_by", {}).get("id", "")) != user_id:
    #     return False
        
    return True

# Helper to ensure event food document exists
def ensure_event_food_exists(event_id: str, user_id: str) -> Dict[str, Any]:
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
    
    # Verify user has access to this event
    if not verify_event_access(event_id, user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this event"
        )
    
    event_food = get_food_collection().find_one({"event_id": ObjectId(event_id)})
    
    if not event_food:
        # Create default food document for this event
        default_food = {
            "event_id": ObjectId(event_id),
            "user_id": user_id,  # Store the user ID in the food document
            "summary": {
                "budget": 0,
                "budget_percentage": 0,
                "vendor_count": 0,
                "vendor_status": "Not started",
                "menu_item_count": 0,
                "dietary_options_count": 0,
                "status": "Planning",
                "last_updated": datetime.utcnow()
            },
            "menu_items": [],
            "beverages": [],
            "vendors": []
        }
        
        get_food_collection().insert_one(default_food)
        event_food = get_food_collection().find_one({"event_id": ObjectId(event_id)})
    
    if not event_food:
        raise HTTPException(status_code=500, detail="Failed to create or retrieve event food document")
    
    return event_food

# Routes
@router.get("/{event_id}/food-summary")
def get_food_summary(event_id: str, user_id: str = Depends(get_current_user)):
    """Get food summary for an event"""
    event_food = ensure_event_food_exists(event_id, user_id)
    return event_food["summary"]

@router.put("/{event_id}/food-summary")
def update_food_summary(event_id: str, summary: FoodSummary, user_id: str = Depends(get_current_user)):
    """Update food summary for an event"""
    ensure_event_food_exists(event_id, user_id)
    
    summary_dict = summary.dict()
    summary_dict["last_updated"] = datetime.utcnow()
    
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$set": {"summary": summary_dict}}
    )
    
    event_food = get_food_collection().find_one({"event_id": ObjectId(event_id)})
    return event_food["summary"]

@router.get("/{event_id}/menu-items", response_model=List[MenuItem])
def get_menu_items(event_id: str, user_id: str = Depends(get_current_user)):
    """Get all menu items for an event"""
    event_food = ensure_event_food_exists(event_id, user_id)
    return event_food.get("menu_items", [])

@router.post("/{event_id}/menu-items")
def create_menu_item(event_id: str, item: MenuItem, user_id: str = Depends(get_current_user)):
    """Add a new menu item to an event"""
    ensure_event_food_exists(event_id, user_id)
    
    item_dict = item.dict()
    
    # Add item to menu items array
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$push": {"menu_items": item_dict}}
    )
    
    # Update summary counts
    dietary_increment = 1 if item.dietary not in ["None", ""] else 0
    
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$inc": {
                "summary.menu_item_count": 1,
                "summary.dietary_options_count": dietary_increment
            },
            "$set": {"summary.last_updated": datetime.utcnow()}
        }
    )
    
    return item_dict

@router.delete("/{event_id}/menu-items/{item_index}")
def delete_menu_item(event_id: str, item_index: int, user_id: str = Depends(get_current_user)):
    """Delete a menu item by index"""
    event_food = ensure_event_food_exists(event_id, user_id)
    
    if "menu_items" not in event_food or len(event_food["menu_items"]) <= item_index:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    # Check if item has dietary restriction before removing
    item_to_remove = event_food["menu_items"][item_index]
    is_dietary = item_to_remove.get("dietary") not in ["None", ""]
    
    # Pull the item at specified index using array filter
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$pull": {
                "menu_items": {
                    "$eq": item_to_remove
                }
            }
        }
    )
    
    # Update summary counts
    update_data = {
        "$inc": {
            "summary.menu_item_count": -1
        },
        "$set": {"summary.last_updated": datetime.utcnow()}
    }
    
    if is_dietary:
        update_data["$inc"]["summary.dietary_options_count"] = -1
    
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        update_data
    )
    
    return {"detail": "Menu item deleted successfully"}

@router.get("/{event_id}/beverages", response_model=List[Beverage])
def get_beverages(event_id: str, user_id: str = Depends(get_current_user)):
    """Get all beverages for an event"""
    event_food = ensure_event_food_exists(event_id, user_id)
    return event_food.get("beverages", [])

@router.post("/{event_id}/beverages")
def create_beverage(event_id: str, beverage: Beverage, user_id: str = Depends(get_current_user)):
    """Add a new beverage to an event"""
    ensure_event_food_exists(event_id, user_id)
    
    beverage_dict = beverage.dict()
    
    # Add beverage to beverages array
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$push": {"beverages": beverage_dict},
            "$set": {"summary.last_updated": datetime.utcnow()}
        }
    )
    
    return beverage_dict

@router.delete("/{event_id}/beverages/{beverage_index}")
def delete_beverage(event_id: str, beverage_index: int, user_id: str = Depends(get_current_user)):
    """Delete a beverage by index"""
    event_food = ensure_event_food_exists(event_id, user_id)
    
    if "beverages" not in event_food or len(event_food["beverages"]) <= beverage_index:
        raise HTTPException(status_code=404, detail="Beverage not found")
    
    # Remove the beverage at specified index
    beverage_to_remove = event_food["beverages"][beverage_index]
    
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$pull": {
                "beverages": {
                    "$eq": beverage_to_remove
                }
            },
            "$set": {"summary.last_updated": datetime.utcnow()}
        }
    )
    
    return {"detail": "Beverage deleted successfully"}

@router.get("/{event_id}/vendors", response_model=List[Vendor])
def get_vendors(event_id: str, user_id: str = Depends(get_current_user)):
    """Get all vendors for an event"""
    event_food = ensure_event_food_exists(event_id, user_id)
    return event_food.get("vendors", [])

@router.post("/{event_id}/vendors")
def create_vendor(event_id: str, vendor: Vendor, user_id: str = Depends(get_current_user)):
    """Add a new vendor to an event"""
    ensure_event_food_exists(event_id, user_id)
    
    vendor_dict = vendor.dict()
    
    # Add vendor to vendors array
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$push": {"vendors": vendor_dict}}
    )
    
    # Get updated vendors to calculate status
    event_food = get_food_collection().find_one({"event_id": ObjectId(event_id)})
    vendors = event_food.get("vendors", [])
    
    vendor_count = len(vendors)
    confirmed_count = sum(1 for v in vendors if v.get("status") == "Confirmed")
    
    vendor_status = "All contracts signed" if vendor_count > 0 and vendor_count == confirmed_count else "In progress"
    
    # Update summary
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$set": {
                "summary.vendor_count": vendor_count,
                "summary.vendor_status": vendor_status,
                "summary.last_updated": datetime.utcnow()
            }
        }
    )
    
    return vendor_dict

@router.put("/{event_id}/vendors/{vendor_index}")
def update_vendor(event_id: str, vendor_index: int, vendor: Vendor, user_id: str = Depends(get_current_user)):
    """Update a vendor by index"""
    event_food = ensure_event_food_exists(event_id, user_id)
    
    if "vendors" not in event_food or len(event_food["vendors"]) <= vendor_index:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    vendor_dict = vendor.dict()
    
    # Update a specific vendor in the array
    vendors = event_food["vendors"]
    vendors[vendor_index] = vendor_dict
    
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$set": {"vendors": vendors}}
    )
    
    # Update vendor status in summary
    confirmed_count = sum(1 for v in vendors if v.get("status") == "Confirmed")
    vendor_status = "All contracts signed" if len(vendors) > 0 and len(vendors) == confirmed_count else "In progress"
    
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$set": {
                "summary.vendor_status": vendor_status,
                "summary.last_updated": datetime.utcnow()
            }
        }
    )
    
    return vendor_dict

@router.delete("/{event_id}/vendors/{vendor_index}")
def delete_vendor(event_id: str, vendor_index: int, user_id: str = Depends(get_current_user)):
    """Delete a vendor by index"""
    event_food = ensure_event_food_exists(event_id, user_id)
    
    if "vendors" not in event_food or len(event_food["vendors"]) <= vendor_index:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    # Remove the vendor at specified index
    vendor_to_remove = event_food["vendors"][vendor_index]
    
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {"$pull": {"vendors": {"$eq": vendor_to_remove}}}
    )
    
    # Get updated vendors to recalculate status
    event_food = get_food_collection().find_one({"event_id": ObjectId(event_id)})
    vendors = event_food.get("vendors", [])
    
    vendor_count = len(vendors)
    confirmed_count = sum(1 for v in vendors if v.get("status") == "Confirmed")
    
    vendor_status = "All contracts signed" if vendor_count > 0 and vendor_count == confirmed_count else "In progress"
    
    # Update summary
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$set": {
                "summary.vendor_count": vendor_count,
                "summary.vendor_status": vendor_status,
                "summary.last_updated": datetime.utcnow()
            }
        }
    )
    
    return {"detail": "Vendor deleted successfully"}