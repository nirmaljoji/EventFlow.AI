# pylint: disable=all
from typing import cast, List
from langchain_core.messages import ToolMessage, AIMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from .state import AgentState, License, LicenseList
from copilotkit.langgraph import copilotkit_emit_message
from .state import AgentState, License, LicenseList
from bson import ObjectId
from datetime import datetime
from ...database.mongodb import MongoDB

async def licenses_node(state: AgentState, config: RunnableConfig): # pylint: disable=unused-argument
    """
    Lets the user know about the operations about to be performed on licenses.
    """
    return state

async def perform_licenses_node(state: AgentState, config: RunnableConfig):
    """Execute License operations"""
    ai_message = cast(AIMessage, state["messages"][-2])
    tool_message = cast(ToolMessage, state["messages"][-1])
    
    if tool_message.content == "CANCEL":
        state["messages"].append(AIMessage(content="Cancelled the license operation."))
        await copilotkit_emit_message(config, "Cancelled the license operation.")
        return state
    
    if not isinstance(ai_message, AIMessage) or not ai_message.tool_calls:
        return state

    action_handlers = {
        "add_licenses": lambda args: handle_add_licenses(state, args),
    }

    # Initialize the foods list if it doesn't exist
    if not state.get("licenses"):
        state["licenses"] = []

    for tool_call in ai_message.tool_calls:
        action = tool_call["name"]
        args = tool_call.get("args", {})
        
        if action in action_handlers:
            message = action_handlers[action](args)
            state["messages"].append(message)
            await copilotkit_emit_message(config, message.content)

    return state

@tool
def add_licenses(licenses: List[License]):
    """Add one or many licenses to the list"""

def handle_add_licenses(state: AgentState, args: dict) -> AIMessage:
    licenses = args.get("licenses", [])
    
    try:
        # Get MongoDB collection
        collection = MongoDB.client.eventflow_db.licenses
        
        # Store each license item in MongoDB
        for license in licenses:
            print("license", license)
            license_data = {
                "name": license.get("name", ""),
                "type": license.get("type", ""),
                "description": license.get("description", ""),
                "status": "pending",
                "dueDate": license.get("dueDate", datetime.utcnow()),
                "issuingAuthority": license.get("issuing_authority", ""),
                "cost": license.get("cost", 0.0),
                "documents": license.get("required_documents", []),
                "notes": license.get("notes", ""),
                "eventId":  str(ObjectId('67ef931b666a4288e98621d7'))  # Default event ID
            }
            
            collection.insert_one(license_data)
        
        # Update state after successful DB operation
        state["licenses"].extend(licenses)
        return AIMessage(content=f"Successfully added the licenses to database and state!")
    except Exception as e:
        return AIMessage(content=f"Failed to add licenses: {str(e)}")
