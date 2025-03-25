from langchain_openai import ChatOpenAI
from typing_extensions import TypedDict, Dict, List, Any, Union
from typing import List, Optional, Literal
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage
from langgraph.errors import NodeInterrupt
from langchain_core.tools import BaseTool
from pydantic import BaseModel
from .state import AgentState
from langgraph.types import Command
from langchain_mcp_adapters.client import MultiServerMCPClient
import os
from dotenv import load_dotenv
from langgraph_supervisor import create_supervisor
from .events_agent.agent import events_graph

load_dotenv()


model = ChatOpenAI(model="gpt-4o", api_key=os.getenv("OPENAI_API_KEY"))
# members = ["EVENTS", "FINISH"]

# # def should_continue(state):
# #     messages = state["messages"]
# #     last_message = messages[-1]
# #     if not last_message.tool_calls:
# #         return END
# #     else:
# #         return "tools"

# class Router(TypedDict):
#     """Worker to route to next. If no workers needed, route to FINISH."""

#     next: str

# async def supervisor_agent(state, config):
#     # options = ["FINISH"] + members
#     system_prompt = (
#         "You are a supervisor tasked with managing a conversation between the"
#         f" following workers: {members}. Given the following user request,"
#         " respond with the worker to act next. Each worker will perform a"
#         " task and respond with their results and status. When finished,"
#         " respond with FINISH."
#     )
#     # messages = [SystemMessage(content=system_prompt)] + state["messages"]
#     # response = await model.with_structured_output(Router).ainvoke(messages)
#     # goto = response["next"]
#     # if goto == "FINISH":
#     #     goto = END

#     # return Command(goto=goto, update={"next": goto})

#     messages = [SystemMessage(content=system_prompt)] + state["messages"]
#     response = await model.ainvoke(messages)

#     return {"messages": [response]}


workflow = StateGraph(AgentState)
workflow = create_supervisor(
    [events_graph],
    model=model,
    prompt=(
        "You are a team supervisor managing a research expert and a math expert. "
        "For current events, use research_agent. "
        "For math problems, use math_agent."
    )
)
# workflow.add_node("supervisor", supervisor_agent)
# workflow.set_entry_point("supervisor")
assistant_ui_graph = workflow.compile()
