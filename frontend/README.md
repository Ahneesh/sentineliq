# SentinelIQ Frontend

The SentinelIQ frontend is the analyst-facing web application for the SentinelIQ trade surveillance and investigation platform.

It is built using React, TypeScript, Vite and Material UI.

---

## Technology Stack

- React
- TypeScript
- Vite
- Material UI
- React Router
- Axios
- Apache ECharts

---

## Current Capabilities

The frontend currently includes:

- Aurora visual theme;
- application routing;
- Data Platform page;
- CSV connector interface;
- upload history;
- upload status and quality indicators;
- dataset profile display;
- enterprise dataset explorer;
- pagination;
- search;
- column sorting;
- current-page CSV export;
- placeholder routes for alerts, investigations, cases and AI assistance.

---

## Directory Structure

```text
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── data-platform/
│   │   └── layout/
│   ├── pages/
│   ├── services/
│   ├── theme/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── eslint.config.js
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
Prerequisites

Use Node.js 22 or later.

Check your version:

node --version
npm --version
Install Dependencies

From the frontend directory:

cd ~/Documents/sentineliq/frontend
npm install
Start the Development Server
cd ~/Documents/sentineliq/frontend
npm run dev

Open:

http://localhost:5173

Data Platform:

http://localhost:5173/data
Backend Dependency

The frontend expects the SentinelIQ FastAPI backend at:

http://localhost:8000

Start the backend separately:

cd ~/Documents/sentineliq
source venv/bin/activate
docker compose up -d
cd backend
alembic upgrade head
uvicorn app.main:app --reload
Main Routes
/                         Dashboard
/data                     Data Platform
/data/:id/explore         Dataset Explorer
/alerts                   Alerts
/investigations           Investigations
/cases                    Cases
/ai                       AI Investigation Assistant

Some routes currently contain prototype or placeholder content.

API Services

Frontend API integrations are located under:

src/services/

The Data Platform currently calls endpoints such as:

GET  /api/uploads
POST /api/uploads
GET  /api/uploads/{upload_id}/profile
GET  /api/uploads/{upload_id}/preview
Development Commands

Start development server:

npm run dev

Run linting:

npm run lint

Create production build:

npm run build

Preview production build:

npm run preview
Clearing the Vite Cache

When frontend types or API response contracts have changed, clear the Vite cache:

cd ~/Documents/sentineliq/frontend
rm -rf node_modules/.vite
npm run dev

Then hard-refresh the browser:

Cmd + Shift + R
Design Principles

The SentinelIQ frontend should be:

professional;
information-dense but readable;
explainable;
responsive;
accessible;
suitable for compliance analysts;
consistent across surveillance workflows.

Semantic colours should be used consistently:

Critical       Red
High           Orange
Medium         Amber
Low            Blue
Success        Green
AI             Purple
Neutral        Grey
Frontend Contribution Guidelines

Before committing frontend changes, run:

npm run lint
npm run build

Use reusable components rather than duplicating UI logic.

Avoid:

hard-coded API URLs across components;
business logic inside presentation components;
confidential data in mock datasets;
direct references to proprietary third-party documentation.
Planned Frontend Features
configurable data-quality rules;
record-level exception explorer;
data catalogue;
canonical order and execution viewer;
scenario administration;
surveillance alert queue;
investigation timeline;
case management;
trader and account profiles;
knowledge graph;
AI investigation assistant;
light and dark themes.
