"""
The search node is responsible for searching the internet for information.
"""

import os
import json
import googlemaps
from typing import cast
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessage, ToolMessage
from langchain.tools import tool
from copilotkit.langgraph import copilotkit_emit_state, copilotkit_customize_config
from .state import AgentState

@tool
def search_for_places(queries: list[str]) -> list[dict]:
    """Search for places based on a query, returns a list of places including their name, address, and coordinates."""


async def search_node(state: AgentState, config: RunnableConfig):
    """
    The search node is responsible for searching the for places.
    """
    ai_message = cast(AIMessage, state["messages"][-1])

    config = copilotkit_customize_config(
        config,
        emit_intermediate_state=[{
            "state_key": "search_progress",
            "tool": "search_for_places",
            "tool_argument": "search_progress",
        }],
    )

    state["search_progress"] = state.get("search_progress", [])
    queries = ai_message.tool_calls[0]["args"]["queries"]

    for query in queries:
        state["search_progress"].append({
            "query": query,
            "results": [],
            "done": False
        })

    await copilotkit_emit_state(config, state)

    places = []
    for i, query in enumerate(queries):
        for j in range(1,10):
            place = {
                "id": "1",
                "name": "test",
                "address": "test_address",
                "latitude":"11111",
                "longitude": "1111",
                "rating": "5",
            }
            places.append(place)
        state["search_progress"][i]["done"] = True
        await copilotkit_emit_state(config, state)

    state["search_progress"] = []
    await copilotkit_emit_state(config, state)

    state["messages"].append(ToolMessage(
        tool_call_id=ai_message.tool_calls[0]["id"],
        content=f"Added the following search results: {json.dumps(places)}"
    ))

    return state
