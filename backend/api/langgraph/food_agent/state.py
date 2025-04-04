from typing import Literal, List, Optional, Dict
from typing_extensions import TypedDict
from langgraph.graph import MessagesState

class Food(TypedDict):
    """A food item with its properties."""
    name: str
    type: Literal["main", "starter", "dessert"]
    dietary: Literal["vegetarian", "vegan", "gluten-free", "dairy-free"]

class FoodList(TypedDict):
    """A list of Food items."""
    items: List[Food]

class FoodAnalytics(TypedDict):
    """Analytics data for food items."""
    menu_item_count: int
    dietary_options_count: int
    dietary_breakdown: Dict[str, int]
    type_breakdown: Dict[str, int]

class AgentState(MessagesState):
    """The state of the agent."""
    foods: List[Food]
    analytics: FoodAnalytics
    
