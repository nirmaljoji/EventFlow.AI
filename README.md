# EventFlow.AI

A modern event management application built with Next.js and Python.

## Prerequisites

- Node.js (Latest LTS version)
- Python (3.11 - 3.14)
- Poetry (Python package manager)

## Setup Instructions

1. Clone the repository
2. Open the project in Cursor IDE
3. Add the backend folder to workspace:
   - Click "Add folder to workspace"
   - Select the backend folder
   - Save workspace file in the repository

### Frontend Setup

1. Create `.env` file in the root directory with:
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NOTION_TOKEN=""
NEXT_PUBLIC_NOTION_PAGE_ID="58768e4460f647119f0a1e5dd40cc9bf"
```

2. Install dependencies:
```bash
npm install
```

### Backend Setup

1. Create `.env` file in the backend directory with:

```
OPENAI_API_KEY=""
MONGODB_URL=""
DATABASE_NAME=eventflow_db

```

1. Navigate to backend directory

2. Install Poetry if not already installed:
```bash
pip install poetry
```

3. Install dependencies using Poetry:
```bash
poetry install
```

## Running the Application

Start the development servers:
```bash
npm run dev
```

This will start both frontend and backend servers.

## Installing new python packages

To add new packages to the backend:
```bash
cd backend
poetry add <package-name>
```
