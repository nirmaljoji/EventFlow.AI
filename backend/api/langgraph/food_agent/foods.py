from typing import cast, List
from langchain_core.messages import ToolMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from .state import AgentState, Food
from copilotkit.langgraph import copilotkit_emit_message
from .state import AgentState, Food, FoodList
from bson import ObjectId
from datetime import datetime
from ...database.mongodb import MongoDB

async def foods_node(state: AgentState, config: RunnableConfig): # pylint: disable=unused-argument
    """
    Lets the user know about the operations about to be performed on foods.
    """
    return state

async def perform_foods_node(state: AgentState, config: RunnableConfig):
    """Execute Food operations"""
    ai_message = cast(AIMessage, state["messages"][-2])
    tool_message = cast(ToolMessage, state["messages"][-1])
    
    if tool_message.content == "CANCEL":
        state["messages"].append(AIMessage(content="Cancelled the food operation."))
        await copilotkit_emit_message(config, "Cancelled the food operation.")
        return state
    
    if not isinstance(ai_message, AIMessage) or not ai_message.tool_calls:
        return state

    action_handlers = {
        "add_foods": lambda args: handle_add_foods(state, args),
    }

    # Initialize the foods list if it doesn't exist
    if not state.get("foods"):
        state["foods"] = []

    for tool_call in ai_message.tool_calls:
        action = tool_call["name"]
        args = tool_call.get("args", {})
        
        if action in action_handlers:
            message = action_handlers[action](args)
            state["messages"].append(message)
            await copilotkit_emit_message(config, message.content)

    return state

@tool
def add_foods(foods: List[Food]):
    """Add one or many foods to the list"""

def handle_add_foods(state: AgentState, args: dict) -> AIMessage:
    foods = args.get("foods", [])
    
    try:
        # Get MongoDB collection
        collection = MongoDB.client.eventflow_db.event_food
        
        # Store each food item in MongoDB
        for food in foods:
            menu_item = {
                "name": food.get("name", ""),
                "type": food.get("type", ""),
                "dietary": food.get("dietary", ""),
                "status": "pending"
            }
            collection.update_one(
                {"event_id": ObjectId('67e74b13ffdc7b65f3f181d5')},
                {
                    "$push": {"menu_items": menu_item},
                    "$inc": {
                        "summary.menu_item_count": 1,
                        "summary.dietary_options_count": 1 if menu_item["dietary"] not in ["None", ""] else 0
                    },
                    "$set": {"summary.last_updated": datetime.utcnow()}
                },
                upsert=True
            )
        
        # Update state after successful DB operation
        state["foods"].extend(foods)
        return AIMessage(content=f"Successfully added the foods to database and state!")
    except Exception as e:
        return AIMessage(content=f"Failed to add foods: {str(e)}")


# @tool
# def delete_foods(trip_ids: List[str]):
#     """Delete one or many foods. YOU MUST NOT CALL this tool multiple times in a row!"""

# def handle_delete_foods(state: AgentState, args: dict) -> AIMessage:
#     trip_ids = args.get("trip_ids", [])
    
#     # Clear selected_trip if it's being deleted
#     if state.get("selected_trip_id") and state["selected_trip_id"] in trip_ids:
#         state["selected_trip_id"] = None

#     state["foods"] = [trip for trip in state["foods"] if trip["id"] not in trip_ids]
#     return AIMessage(content=f"Successfully deleted the trip(s)!")

# @tool
# def update_foods(foods: List[Trip]):
#     """Update one or many foods"""

# def handle_update_foods(state: AgentState, args: dict) -> AIMessage:
#     foods = args.get("foods", [])
#     for trip in foods:
#         state["foods"] = [
#             {**existing_trip, **trip} if existing_trip["id"] == trip["id"] else existing_trip
#             for existing_trip in state["foods"]
#         ]
#     return AIMessage(content=f"Successfully updated the trip(s)!")
