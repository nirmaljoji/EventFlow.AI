# pylint: disable=all
import json
from .state import AgentState
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from .search import search_for_licenses
from .licenses import add_licenses
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessage, ToolMessage
from typing import cast
from langchain_core.tools import tool
from .search import search_for_licenses

import os
import dotenv
dotenv.load_dotenv()


llm = ChatOpenAI(model="gpt-4o", api_key="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")
tools = [search_for_licenses]

async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle License operations"""
    llm_with_tools = llm.bind_tools(
        [
            *tools,
            add_licenses,
            # update_licenses,
            # delete_licenses,
            # select_trip,
        ],
        parallel_tool_calls=False,
    )

    system_message = f"""
    You are an agent that plans licenses and helps the user with planning and managing their licenses.
    
    Call search_for_licenses when you need to find licenses.
    Call add_licenses when you need to add licenses.
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
        "licenses": state.get("licenses", [])
    }
