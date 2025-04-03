import json
from .state import AgentState
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from .search import search_for_food
from .foods import add_foods
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessage, ToolMessage
from typing import cast
from langchain_core.tools import tool
from .search import search_for_food

import os
import dotenv
dotenv.load_dotenv()

@tool
def select_trip(trip_id: str):
    """Select a trip"""
    return f"Selected trip {trip_id}"

llm = ChatOpenAI(model="gpt-4o", api_key=os.environ["OPENAI_API_KEY"])
tools = [search_for_food]

async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle chat operations"""
    llm_with_tools = llm.bind_tools(
        [
            *tools,
            add_foods,
            # update_foods,
            # delete_foods,
            # select_trip,
        ],
        parallel_tool_calls=False,
    )

    system_message = f"""
    You are an agent that plans foods and helps the user with planning and managing their foods.
    If the user did not specify a location, you should ask them for a location.
    
    Plan the foods for the user, take their preferences into account if specified, but if they did not
    specify any preferences, call the search_for_places tool to find places of interest, restaurants, and activities.

    Unless the users prompt specifies otherwise, only use the first 10 results from the search_for_places tool relevant
    to the trip.

    When you add or edit a trip, you don't need to summarize what you added. Just give a high level summary of the trip
    and why you planned it that way.
    
    When you create or update a trip, you should set it as the selected trip.
    If you delete a trip, try to select another trip.

    If an operation is cancelled by the user, DO NOT try to perform the operation again. Just ask what the user would like to do now
    instead.
    
    """

    # calling ainvoke instead of invoke is essential to get streaming to work properly on tool calls.
    response = await llm_with_tools.ainvoke(
        [
            SystemMessage(content=system_message),
            *state["messages"]
        ],
        config=config,
    )

    ai_message = cast(AIMessage, response)

    return {
        "messages": [response],
        "foods": state.get("foods", [])
    }
