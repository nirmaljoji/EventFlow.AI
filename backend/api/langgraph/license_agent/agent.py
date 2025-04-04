"""
This is the main entry point for the AI.
It defines the workflow graph and the entry point for the agent.
"""
# pylint: disable=all
from typing import cast
from langchain_core.messages import ToolMessage, AIMessage
from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from .licenses import licenses_node
from .chat import chat_node
from .search import search_node
from .licenses import perform_licenses_node
from .state import AgentState

# Route is responsible for determing the next node based on the last message. This
# is needed because LangGraph does not automatically route to nodes, instead that
# is handled through code.
def route(state: AgentState):
    """Route after the chat node."""
    messages = state.get("messages", [])
    if messages and isinstance(messages[-1], AIMessage):
        ai_message = cast(AIMessage, messages[-1])
        
        # If the last AI message has tool calls we need to determine to route to the
        # licenses_node or search_node based on the tool name.
        if ai_message.tool_calls:
            tool_name = ai_message.tool_calls[0]["name"]
            if tool_name in ["add_licenses"]:
                return "licenses_node"
            if tool_name in ["search_for_licenses"]:
                return "search_node"
            return "chat_node"
    
    if messages and isinstance(messages[-1], ToolMessage):
        return "chat_node"
    
    return END

graph_builder = StateGraph(AgentState)

graph_builder.add_node("chat_node", chat_node)
graph_builder.add_node("licenses_node", licenses_node)
graph_builder.add_node("search_node", search_node)
graph_builder.add_node("perform_licenses_node", perform_licenses_node)

graph_builder.add_conditional_edges("chat_node", route, ["search_node", "chat_node", "licenses_node", END])

graph_builder.add_edge(START, "chat_node")
graph_builder.add_edge("search_node", "chat_node")
graph_builder.add_edge("perform_licenses_node", "chat_node")
graph_builder.add_edge("licenses_node", "perform_licenses_node")

graph = graph_builder.compile(
    checkpointer=MemorySaver(),
    interrupt_after=["licenses_node"],
)
