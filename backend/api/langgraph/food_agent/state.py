from typing import Literal, List, Optional
from typing_extensions import TypedDict
from langgraph.graph import MessagesState

class Food(TypedDict):
    """A trip."""
    id: str
    name: str
    cuisine: float
    cost: float

class AgentState(MessagesState):
    """The state of the agent."""
    foods: List[Food]
