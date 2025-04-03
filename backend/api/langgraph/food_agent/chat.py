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


llm = ChatOpenAI(model="gpt-4o", api_key=os.environ["OPENAI_API_KEY"])
tools = [search_for_food]

async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle Food operations"""
    llm_with_tools = llm.bind_tools(
        [
            *tools,
            # add_foods,
            # update_foods,
            # delete_foods,
            # select_trip,
        ],
        parallel_tool_calls=False,
    )

    system_message = f"""
    You are an agent that plans foods and helps the user with planning and managing their foods.
    
    Call search_for_food when you need to find foods.
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
