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
from .summary import search_for_summary

import os
import dotenv
dotenv.load_dotenv()


llm = ChatOpenAI(model="gpt-4o", api_key="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")
tools = [search_for_food]

async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle Food operations"""
    llm_with_tools = llm.bind_tools(
        [
            *tools,
            add_foods,
            search_for_summary,
            # update_foods,
            # delete_foods,
            # select_trip,
        ],
        parallel_tool_calls=False,
    )

    system_message = f"""
    You are an agent that plans foods and helps the user with planning and managing their foods.
    
    Call search_for_food when you need to find foods.
    Call foods_node when you need to add foods.
    Call search_for_summary when you need to get a summary of the foods or any similar analytics information.
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
