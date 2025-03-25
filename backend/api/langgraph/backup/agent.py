from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage
from langgraph.errors import NodeInterrupt
from langchain_core.tools import BaseTool
from pydantic import BaseModel
from .tools import tools
from typing import Literal
from typing_extensions import TypedDict
from ..state import AgentState
import os
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage
from langgraph.types import Command
from typing import List, Optional, Literal
from ..events_agent.agent import events_graph


load_dotenv()


model = ChatOpenAI(api_key=os.getenv("OPENAI_API_KEY"), model="gpt-4o")

members = ["events_team"]
# Our team supervisor is an LLM node. It just picks the next agent to process
# and decides when the work is completed
options = members + ["FINISH"]

system_prompt = (
    "You are a supervisor tasked with managing a conversation between the"
    f" following workers: {members}. Given the following user request,"
    " respond with the worker to act next. Each worker will perform a"
    " task and respond with their results and status. When finished,"
    " respond with FINISH."
)


class Router(TypedDict):
    """Worker to route to next. If no workers needed, route to FINISH."""

    next: Literal[*options]


def supervisor_node(state: AgentState) -> Command[Literal[*members, "__end__"]]:
    messages = [
        {"role": "system", "content": system_prompt},
    ] + state["messages"]
    response = model.with_structured_output(Router).invoke(messages)
    goto = response["next"]
    if goto == "FINISH":
        goto = END

    return Command(goto=goto, update={"next": goto})


async def call_events_team(state: AgentState) -> Command[Literal["supervisor"]]:
    response = await events_graph.ainvoke({"messages": state["messages"][-1]})
    return {"messages": response}

super_builder = StateGraph(AgentState)
super_builder.add_node("supervisor", supervisor_node)
super_builder.add_node("events_team", call_events_team)

super_builder.set_entry_point("supervisor")

assistant_ui_graph = super_builder.compile()
