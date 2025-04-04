# pylint: disable=all
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
dotenv.load_dotenv()
import langchain
from langchain.schema import HumanMessage, AIMessage, SystemMessage, BaseMessage

class License(BaseModel):
    """A License."""
    issuing_authority: str = Field(description = "The name of the issuing authority")
    cost: float = Field(description = "The cost of the license")
    required_documents: List[str] = Field(description = "The documents required to obtain the license")
    notes: str = Field(description = "Any additional notes about the license")

class LicenseList(BaseModel):
    """A list of License items."""
    items: List[License] = Field(description = "List of license items")

@tool
def search_for_licenses(query: str) -> list[dict]:
    """Search for licenses based on a query, returns a list of licenses including their name, type, and description."""

async def search_node(state: AgentState, config: RunnableConfig):
    """
    The search node is responsible for searching the for licenses and permits that match the query.
    """
    custom_config = copilotkit_customize_config(
        config,
        emit_messages=False,
        emit_tool_calls=False
    )

    ai_message = cast(AIMessage, state["messages"][-1])
    query = ai_message.tool_calls[0]["args"]["query"]


    model = ChatOpenAI(model="gpt-4o", api_key="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")
    model_with_structure = model.with_structured_output(LicenseList)
    tool_msg = model_with_structure.invoke(query, config=custom_config)
    
    # Format the license information as a human-readable string
    # formatted_results = "Here are the license options I found:\n\n"
    
    # for i, license in enumerate(tool_msg.items):
    #     formatted_results += f"**{license.issuing_authority}**\n"
    #     formatted_results += f"* Cost: ${license.cost}\n"
    #     formatted_results += "* Required Documents:\n"
    #     for doc in license.required_documents:
    #         formatted_results += f"  - {doc}\n"
    #     if license.notes:
    #         formatted_results += f"* Notes: {license.notes}\n"
    #     formatted_results += "\n"
    
    # Store the license data for potential future use
    license_list = []
    for i, license in enumerate(tool_msg.items):
        documents = [{"name": doc, "uploaded": False} for doc in license.required_documents]
        license_list.append({
            "id": str(i),
            "name": license.issuing_authority,
            "type": "License",
            "description": license.notes,
            "status": "pending",
            "dueDate": "",
            "issuingAuthority": license.issuing_authority,
            "cost": license.cost,
            "icon": "FileCheck",
            # "requiredFields": required_fields,
            "documents": documents,
            "notes": license.notes
        })

    # Add licenses to state for later use
    # if "license_list" not in state:
    #     state["license_list"] = []
    # state["license_list"].extend(license_list)

    # Serialize the list to a JSON string for the ToolMessage content
    tool_message_content = json.dumps(license_list)

    state["messages"].append(ToolMessage(
        tool_call_id=ai_message.tool_calls[0]["id"],
        # Use the JSON string as content
        content=tool_message_content
    ))
    
    await copilotkit_emit_state(custom_config, state)

    return state
