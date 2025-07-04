from typing import Literal, List, Optional
from typing_extensions import TypedDict
from langgraph.graph import MessagesState

class License(TypedDict):
    """A license."""
    name: str
    issuing_authority: str
    cost: float
    required_documents: List[str]
    notes: str
    type: Literal["Venue", "Food", "Safety", "Entertainment", "Logistics"]

class LicenseList(TypedDict):
    """A list of License items."""
    items: List[License]

class AgentState(MessagesState):
    """The state of the agent."""
    licenses: List[License]
