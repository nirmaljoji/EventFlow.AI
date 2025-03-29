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
    budget: float = 0
    budget_percentage: int = 0
    vendor_count: int = 0
    vendor_status: str = "Not started"
    menu_item_count: int = 0
    dietary_options_count: int = 0
    status: str = "Planning"
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class EventFoodData(BaseModel):
    summary: FoodSummary
    menu_items: List[MenuItem] = []
    beverages: List[Beverage] = []
    vendors: List[Vendor] = []

# Helper function to access the collection
def get_food_collection():
    collection = MongoDB.client.eventflow_db.event_food
    if collection is None:
        raise HTTPException(status_code=500, detail="MongoDB collection not found")
    return collection

# Routes
@router.get("/{event_id}/food-data", response_model=EventFoodData)
def get_food_data(event_id: str, user_id: str = Depends(get_current_user)):
    """Get all food data for an event in a single request"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")

    collection = get_food_collection()
    event_food = collection.find_one({"event_id": ObjectId(event_id)})
    
    if not event_food:
        # Return default values from Pydantic model
        return EventFoodData(summary=FoodSummary())
    
    return {
        "summary": event_food.get("summary", FoodSummary().dict()),
        "menu_items": event_food.get("menu_items", []),
        "beverages": event_food.get("beverages", []),
        "vendors": event_food.get("vendors", [])
    }

@router.post("/{event_id}/menu-items")
def create_menu_item(event_id: str, item: MenuItem, user_id: str = Depends(get_current_user)):
    """Add a new menu item to an event"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
    
    item_dict = item.dict()
    
    # Add item to menu items array and update summary
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$push": {"menu_items": item_dict},
            "$inc": {
                "summary.menu_item_count": 1,
                "summary.dietary_options_count": 1 if item.dietary not in ["None", ""] else 0
            },
            "$set": {"summary.last_updated": datetime.utcnow()}
        },
        upsert=True
    )
    
    return item_dict

@router.post("/{event_id}/beverages")
def create_beverage(event_id: str, beverage: Beverage, user_id: str = Depends(get_current_user)):
    """Add a new beverage to an event"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
    
    beverage_dict = beverage.dict()
    
    # Add beverage to beverages array
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$push": {"beverages": beverage_dict},
            "$set": {"summary.last_updated": datetime.utcnow()}
        },
        upsert=True
    )
    
    return beverage_dict

@router.post("/{event_id}/vendors")
def create_vendor(event_id: str, vendor: Vendor, user_id: str = Depends(get_current_user)):
    """Add a new vendor to an event"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
    
    vendor_dict = vendor.dict()
    
    # Add vendor and update summary
    get_food_collection().update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$push": {"vendors": vendor_dict},
            "$inc": {"summary.vendor_count": 1},
            "$set": {
                "summary.vendor_status": "In progress",
                "summary.last_updated": datetime.utcnow()
            }
        },
        upsert=True
    )
    
    return vendor_dict

@router.put("/{event_id}/menu-items/{item_index}")
def update_menu_item(event_id: str, item_index: int, item: MenuItem, user_id: str = Depends(get_current_user)):
    """Update a menu item by index"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
        
    collection = get_food_collection()
    event_food = collection.find_one({"event_id": ObjectId(event_id)})
    
    if not event_food or "menu_items" not in event_food or len(event_food["menu_items"]) <= item_index:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    old_item = event_food["menu_items"][item_index]
    item_dict = item.dict()
    
    # Update menu item and handle dietary count changes
    old_dietary = old_item.get("dietary", "None") not in ["None", ""]
    new_dietary = item_dict.get("dietary", "None") not in ["None", ""]
    dietary_change = 1 if new_dietary and not old_dietary else -1 if old_dietary and not new_dietary else 0
    
    menu_items = event_food["menu_items"]
    menu_items[item_index] = item_dict
    
    update_data = {
        "$set": {
            "menu_items": menu_items,
            "summary.last_updated": datetime.utcnow()
        }
    }
    
    if dietary_change != 0:
        update_data["$inc"] = {"summary.dietary_options_count": dietary_change}
    
    collection.update_one(
        {"event_id": ObjectId(event_id)},
        update_data
    )
    
    return item_dict

@router.put("/{event_id}/beverages/{beverage_index}")
def update_beverage(event_id: str, beverage_index: int, beverage: Beverage, user_id: str = Depends(get_current_user)):
    """Update a beverage by index"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
        
    collection = get_food_collection()
    event_food = collection.find_one({"event_id": ObjectId(event_id)})
    
    if not event_food or "beverages" not in event_food or len(event_food["beverages"]) <= beverage_index:
        raise HTTPException(status_code=404, detail="Beverage not found")
    
    beverage_dict = beverage.dict()
    beverages = event_food["beverages"]
    beverages[beverage_index] = beverage_dict
    
    collection.update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$set": {
                "beverages": beverages,
                "summary.last_updated": datetime.utcnow()
            }
        }
    )
    
    return beverage_dict

@router.put("/{event_id}/vendors/{vendor_index}")
def update_vendor(event_id: str, vendor_index: int, vendor: Vendor, user_id: str = Depends(get_current_user)):
    """Update a vendor by index"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
        
    collection = get_food_collection()
    event_food = collection.find_one({"event_id": ObjectId(event_id)})
    
    if not event_food or "vendors" not in event_food or len(event_food["vendors"]) <= vendor_index:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    vendor_dict = vendor.dict()
    vendors = event_food["vendors"]
    vendors[vendor_index] = vendor_dict
    
    # Update vendor and recalculate status
    confirmed_count = sum(1 for v in vendors if v.get("status") == "Confirmed")
    vendor_status = "All contracts signed" if len(vendors) > 0 and len(vendors) == confirmed_count else "In progress"
    
    collection.update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$set": {
                "vendors": vendors,
                "summary.vendor_status": vendor_status,
                "summary.last_updated": datetime.utcnow()
            }
        }
    )
    
    return vendor_dict

@router.delete("/{event_id}/menu-items/{item_index}")
def delete_menu_item(event_id: str, item_index: int, user_id: str = Depends(get_current_user)):
    """Delete a menu item by index"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
        
    collection = get_food_collection()
    event_food = collection.find_one({"event_id": ObjectId(event_id)})
    
    if not event_food or "menu_items" not in event_food or len(event_food["menu_items"]) <= item_index:
        raise HTTPException(status_code=404, detail="Menu item not found")
    
    item_to_remove = event_food["menu_items"][item_index]
    is_dietary = item_to_remove.get("dietary") not in ["None", ""]
    
    collection.update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$pull": {"menu_items": {"$eq": item_to_remove}},
            "$inc": {
                "summary.menu_item_count": -1,
                "summary.dietary_options_count": -1 if is_dietary else 0
            },
            "$set": {"summary.last_updated": datetime.utcnow()}
        }
    )
    
    return {"detail": "Menu item deleted successfully"}

@router.delete("/{event_id}/beverages/{beverage_index}")
def delete_beverage(event_id: str, beverage_index: int, user_id: str = Depends(get_current_user)):
    """Delete a beverage by index"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
        
    collection = get_food_collection()
    event_food = collection.find_one({"event_id": ObjectId(event_id)})
    
    if not event_food or "beverages" not in event_food or len(event_food["beverages"]) <= beverage_index:
        raise HTTPException(status_code=404, detail="Beverage not found")
    
    beverage_to_remove = event_food["beverages"][beverage_index]
    
    collection.update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$pull": {"beverages": {"$eq": beverage_to_remove}},
            "$set": {"summary.last_updated": datetime.utcnow()}
        }
    )
    
    return {"detail": "Beverage deleted successfully"}

@router.delete("/{event_id}/vendors/{vendor_index}")
def delete_vendor(event_id: str, vendor_index: int, user_id: str = Depends(get_current_user)):
    """Delete a vendor by index"""
    if not ObjectId.is_valid(event_id):
        raise HTTPException(status_code=400, detail="Invalid event ID format")
        
    collection = get_food_collection()
    event_food = collection.find_one({"event_id": ObjectId(event_id)})
    
    if not event_food or "vendors" not in event_food or len(event_food["vendors"]) <= vendor_index:
        raise HTTPException(status_code=404, detail="Vendor not found")
    
    vendor_to_remove = event_food["vendors"][vendor_index]
    
    collection.update_one(
        {"event_id": ObjectId(event_id)},
        {
            "$pull": {"vendors": {"$eq": vendor_to_remove}},
            "$inc": {"summary.vendor_count": -1},
            "$set": {
                "summary.vendor_status": "Not started",
                "summary.last_updated": datetime.utcnow()
            }
        }
    )
    
    return {"detail": "Vendor deleted successfully"}