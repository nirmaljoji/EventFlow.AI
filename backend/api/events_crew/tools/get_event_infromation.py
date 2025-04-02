from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field


class GetEventInformationInput(BaseModel):
    """Input schema for MyCustomTool."""
    argument: str = Field(..., description="Name of the Event")

class GetEventInformation(BaseTool):
    name: str = "Name of my tool"
    description: str = (
        "Clear description for what this tool is useful for, your agent will need this information to use it."
    )
    args_schema: Type[BaseModel] = GetEventInformationInput

    def _run(self, argument: str) -> str:
        # Implementation goes here
        mock_response_event = """
        {
            "event": {
                "name": "Customer Exeperience Event",
                "description": "Product Launch Event",
                "date": "2023-08-01",
                "location": "Raleigh",
                "food": [
                    {
                        "name": "Food Item 1",
                        "quantity": 10,
                        "unit": "units"
                    }
        }
        """
        return mock_response_event
