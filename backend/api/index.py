from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from .langgraph.supervisor_agent import assistant_ui_graph
from .routes.add_langgraph_route import add_langgraph_route
from .routes.auth import router as auth_router
from .routes.events import router as events_router
from .routes.food import router as food_router
from .routes.licenses import router as licenses_router
from .database.mongodb import MongoDB
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    MongoDB.connect_db()
    yield
    MongoDB.close_db()

app = FastAPI(lifespan=lifespan)
# cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

add_langgraph_route(app, assistant_ui_graph, "/api/chat")
app.include_router(auth_router, prefix="/api/auth")
app.include_router(events_router, prefix="/api/events", tags=["events"])
app.include_router(food_router, prefix="/api/events", tags=["food"])
app.include_router(licenses_router, prefix="/api/events", tags=["licenses"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)