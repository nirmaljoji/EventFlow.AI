"""
The search node is responsible for searching the internet for information.
"""

import os
import json
import googlemaps
from typing import cast, List
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


class Food(BaseModel):
    """A Food."""
    id: str = Field(description = "The id of the food")
    name: str = Field(description = "The name of the food")
    cuisine: float = Field(description = "The cuisine of the food")
    cost: float = Field(description = "The cost of the food")

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
    ai_message = cast(AIMessage, state["messages"][-1])

    config = copilotkit_customize_config(
        config
    )

    queries = ai_message.tool_calls[0]["args"]["query"]

    model = ChatOpenAI(model="gpt-4o", api_key=os.environ["OPENAI_API_KEY"])
    model_with_structure = model.with_structured_output(FoodList)
    structured_output = model_with_structure.invoke(queries, config=config)

    # Convert structured output to JSON format
    food_list = []
    for food in structured_output.items:
        food_list.append({
            "name": food.name,
            "cuisine": food.cuisine,
            "cost": food.cost
        })
    
    json_output = json.dumps(food_list)

    await copilotkit_emit_state(config, state)

    state["messages"].append(ToolMessage(
        tool_call_id=ai_message.tool_calls[0]["id"],
        content=f"Added the following search results: {json_output}"
    ))

    return state
