"""
The search node is responsible for searching the internet for information.
"""

import os
import json
import googlemaps
from typing import cast, List, Literal
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessage, ToolMessage
from langchain.tools import tool
from copilotkit.langgraph import copilotkit_emit_state, copilotkit_customize_config
from .state import AgentState
from pydantic import BaseModel, Field
import os
import dotenv
from ...database.mongodb import MongoDB
from bson import ObjectId
dotenv.load_dotenv()
import langchain
from langchain.schema import HumanMessage, AIMessage, SystemMessage, BaseMessage


@tool
def search_for_summary() -> list[dict]:
    """Summarize the food items in the database."""

async def summary_node(state: AgentState, config: RunnableConfig):
    """
    The summary node is responsible for summarizing the food items in the database.
    """
            # Get MongoDB collection
    collection = MongoDB.client.eventflow_db.event_food
    
    # Fetch the event document with menu items
    event_doc = collection.find_one(
        {"event_id": ObjectId('67e744630b536e26e3fd3976')},
        {"menu_items": 1}
    )
    
    if not event_doc or "menu_items" not in event_doc:
        return AIMessage(content="No food items found in the database.")
    
    menu_items = event_doc["menu_items"]
    ai_message = cast(AIMessage, state["messages"][-1])

    print(" FINAL MESSAGE", ai_message)
    custom_config = copilotkit_customize_config(
        config,
        emit_messages=False,
        emit_tool_calls=False
    )
    # Group items by type
    items_by_type = {}
    for item in menu_items:
        food_type = item.get("type", "unspecified")
        if food_type not in items_by_type:
            items_by_type[food_type] = []
        items_by_type[food_type].append(item["name"])
    # Group items by dietary preference
    items_by_dietary = {}
    for item in menu_items:
        dietary = item.get("dietary", "unspecified")
        if dietary in ["", "None"]:
            dietary = "unspecified"
        if dietary not in items_by_dietary:
            items_by_dietary[dietary] = []
        items_by_dietary[dietary].append(item["name"])
    
    # Count items by type
    type_counts = {}
    for item in menu_items:
        food_type = item.get("type", "unspecified")
        type_counts[food_type] = type_counts.get(food_type, 0) + 1
    
    # Count items by dietary preference
    dietary_counts = {}
    for item in menu_items:
        dietary = item.get("dietary", "unspecified")
        if dietary in ["", "None"]:
            dietary = "unspecified"
        dietary_counts[dietary] = dietary_counts.get(dietary, 0) + 1
    
    # Create JSON summary
    # Create analytics object to update state
    analytics = {
        "menu_item_count": len(menu_items),
        "dietary_options_count": len(dietary_counts),
        "dietary_breakdown": dietary_counts,
        "type_breakdown": type_counts
    }
    print("ANALYTICS", analytics)
    # Update state with foods and analytics
    state["analytics"] = analytics
    
    # Create summary message
    summary = [f"Found {len(menu_items)} food items in total:\n"]
    print("SUMMARY", summary)

    for food_type, items in items_by_type.items():
        summary.append(f"\n{food_type.capitalize()} ({len(items)}):")
        for item in items:
            summary.append(f"- {item}")

    tool_message_content = json.dumps(analytics)

    state["messages"].append(ToolMessage(
        tool_call_id=ai_message.tool_calls[0]["id"],
        # Use the JSON string as content
        content=tool_message_content
    ))
    await copilotkit_emit_state(custom_config, state)
    return state

