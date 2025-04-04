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

class Food(BaseModel):
    """A Food."""
    name: str = Field(description = "The name of the food")
    type: Literal["main", "starter", "dessert"] = Field(description = "The type of the food")
    dietary: Literal["vegetarian", "vegan", "gluten-free", "dairy-free"] = Field(description = "The dietary restrictions of the food")

class FoodList(BaseModel):
    """A list of Food items."""
    items: List[Food] = Field(description = "List of food items")

@tool
def search_for_food(query: str) -> list[dict]:
    """Search for food based on a query, returns a list of foods including their name, cuisine, and price."""

async def search_node(state: AgentState, config: RunnableConfig):
    """
    The search node is responsible for searching the for food.
    """
    #     # Customize config to disable message emission to frontend during tool execution
    # custom_config = copilotkit_customize_config(
    #     config,
    #     emit_messages=False,
    #     emit_tool_calls=False
    # )
    # msgs = []  # List to store tool messages
    # tool_state = {}  # Dictionary to store updated state after tool execution
    # # Process each tool call from the last message (assumed to be an AIMessage)
    # for tool_call in state["messages"][-1].tool_calls:
    #     tool = tool_call["name"] # Lookup tool by name
    #     # Simplify messages structure temporarily for tool access
    #     tool_call["args"]["state"] = state  # Inject state into tool arguments
    #     query = tool_call["args"]["query"]  # Extract query from tool arguments
    #     # Run the tool asynchronously and get updated state and message
    #     model = ChatOpenAI(model="gpt-4o", api_key=os.environ["OPENAI_API_KEY"])
    #     model_with_structure = model.with_structured_output(FoodList)
    #     tool_msg = model_with_structure.invoke(query, config=custom_config)
    #     tool_call["args"]["state"] = None  # Clear state from args after execution
    #     # Append tool result as a ToolMessage

    #     food_list = []
    #     for food in tool_msg.items:
    #         food_list.append({
    #             "name": food.name,
    #             "type": food.type,
    #             "dietary": food.dietary
    #         })

    #     print("Tool message: ", food_list)

    #     msgs.append(ToolMessage(content=tool_msg, name=tool_call["name"], tool_call_id=tool_call["id"]))
    #     # Build updated tool state with research data
    #     tool_state = {
    #         "foods": food_list,
    #         "messages": msgs
    #     }

    #     state["foods"].extend(food_list)
    #     # # Emit updated state to frontend
    #     # await copilotkit_emit_state(custom_config, tool_state)

    # return state


    custom_config = copilotkit_customize_config(
        config,
        emit_messages=False,
        emit_tool_calls=False
    )

    ai_message = cast(AIMessage, state["messages"][-1])
    query = ai_message.tool_calls[0]["args"]["query"]


    model = ChatOpenAI(model="gpt-4o", api_key="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")
    model_with_structure = model.with_structured_output(FoodList)
    tool_msg = model_with_structure.invoke(query, config=custom_config)
    # Convert structured output to JSON format
    food_list = []
    for i, food in enumerate(tool_msg.items):

        food_list.append({
            "id": i,
            "name": food.name,
            "type": food.type,
            "dietary": food.dietary
        })

    
    json_output = json.dumps(food_list)

    state["messages"].append(ToolMessage(
        tool_call_id=ai_message.tool_calls[0]["id"],
        content=f"Added the following search results: {food_list}"
    ))
    await copilotkit_emit_state(custom_config, state)

    return state
