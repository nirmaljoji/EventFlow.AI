from langchain_core.tools import tool
from datetime import datetime, timezone


@tool(return_direct=True)
def get_events_details(event_name: str):
    """Call to get information regarding your events"""
    # This is a mock implementation
    mock_events_data = [
        {
            "id": "6",
            "title": "Customer Experience Forum",
            "description": "Discussing best practices in customer experience",
            "location": "Miami, FL",
            "attendees": 300,
            "coverImage": "/placeholder.svg?height=128&width=384&text=CX+Forum",
            "organizer": "EvenFlow.AI",
            "type": "Forum",
        },
        # Add more mock data for other symbols as needed
    ]

    return mock_events_data


tools = [get_events_details]
