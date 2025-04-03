from typing import Literal, List, Optional
from typing_extensions import TypedDict
from langgraph.graph import MessagesState

class Food(TypedDict):
    """A trip."""
    name: str
    type: Literal["main", "starter", "dessert"]
    dietary: Literal["vegetarian", "vegan", "gluten-free", "dairy-free"]

class FoodList(TypedDict):
    """A list of Food items."""
    items: List[Food]

class AgentState(MessagesState):
    """The state of the agent."""
    foods: List[Food]
