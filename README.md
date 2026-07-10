# SentinelIQ

SentinelIQ is an AI-native trade surveillance and market abuse investigation platform.

It is being designed as a modern alternative to legacy surveillance platforms, with a focus on:

- explainable surveillance alerts;
- configurable market-abuse scenarios;
- data quality and lineage;
- analyst-friendly investigations;
- evidence-driven risk scoring;
- AI-assisted triage and reporting.

> SentinelIQ is currently an early-stage development and demonstration platform. It is not yet production-ready compliance software and must not be relied upon for regulatory decisions.

---

## Current Status

Current development branch:

```text
feature/data-platform
Current implemented capabilities:

React and TypeScript frontend;
FastAPI backend;
PostgreSQL database;
Docker-based local database;
Alembic database migrations;
CSV ingestion;
upload history;
file persistence;
automated dataset profiling;
inferred column types;
dataset quality scoring;
duplicate and null analysis;
dataset profile view;
enterprise dataset explorer;
server-side pagination;
dataset search and sorting;
backend API health checks;
backend tests and linting foundation.
Product Vision

SentinelIQ is intended to support the full surveillance lifecycle:

Data ingestion
    ↓
Data validation and profiling
    ↓
Canonical order and trade model
    ↓
Surveillance scenarios
    ↓
Risk-scored alerts
    ↓
Investigation workspace
    ↓
Case management
    ↓
Regulatory reporting

The long-term platform may support:

trade surveillance;
communications surveillance;
conduct risk;
employee surveillance;
anti-money-laundering analytics;
knowledge-graph investigations;
AI-assisted investigations.
Architecture

SentinelIQ uses a monorepo structure:

sentineliq/
├── backend/               FastAPI, SQLAlchemy, Alembic and analytics
├── frontend/              React, TypeScript, Vite and Material UI
├── data/                  Synthetic sample datasets
├── docs/                  Product, architecture and engineering documentation
├── infra/                 Infrastructure configuration
├── scripts/               Developer utilities
├── tests/                 Cross-platform tests
├── .github/workflows/     Continuous integration
├── docker-compose.yml     Local PostgreSQL environment
├── Makefile               Common developer commands
└── README.md
Backend
Python
FastAPI
SQLAlchemy
PostgreSQL
Alembic
Polars
Pytest
Ruff
Black
Frontend
React
TypeScript
Vite
Material UI
React Router
Axios
Apache ECharts
Planned Technologies

These are not all implemented yet:

DuckDB
Redis
Kafka
Neo4j
OpenSearch
object storage
OpenAI or Azure OpenAI
Prerequisites

Install:

Docker Desktop
Python 3.12 or later
Node.js 22 or later
npm
Git

The project has primarily been developed on macOS with Apple Silicon.

Local Development Setup
1. Clone the repository
git clone https://github.com/Ahneesh/sentineliq.git
cd sentineliq
2. Create the Python virtual environment
python3 -m venv venv
source venv/bin/activate
3. Start Docker Desktop

On macOS:

open -a Docker

Wait until Docker Desktop is running.

4. Start PostgreSQL
docker compose up -d
docker ps

You should see:

sentineliq-postgres
5. Install backend dependencies
source venv/bin/activate
pip install -r backend/requirements.txt
6. Apply database migrations
cd backend
alembic upgrade head
7. Start the backend

From backend/:

uvicorn app.main:app --reload

Backend URLs:

http://localhost:8000
http://localhost:8000/docs
http://localhost:8000/api/health
http://localhost:8000/api/health/db
8. Start the frontend

Open a second terminal:

cd ~/Documents/sentineliq/frontend
npm install
npm run dev

Frontend URL:

http://localhost:5173

Data Platform:

http://localhost:5173/data
Running the Application After Initial Setup
Terminal 1 — Backend
cd ~/Documents/sentineliq
source venv/bin/activate
open -a Docker
docker compose up -d
cd backend
alembic upgrade head
uvicorn app.main:app --reload
Terminal 2 — Frontend
cd ~/Documents/sentineliq/frontend
npm run dev
Current User Workflow
Open the Data Platform.
Upload a CSV dataset.
SentinelIQ stores the uploaded file.
The backend profiles the dataset.
Upload metadata is persisted in PostgreSQL.
The profile shows:
row and column counts;
inferred data types;
null percentages;
duplicate rows;
statistics;
data quality score.
Open the Dataset Explorer.
Search, sort and paginate through uploaded records.
API Endpoints

Interactive API documentation:

http://localhost:8000/docs

Current principal endpoints include:

GET  /api/health
GET  /api/health/db
GET  /api/uploads
POST /api/uploads
GET  /api/uploads/{upload_id}/profile
GET  /api/uploads/{upload_id}/preview
Tests

Run backend tests:

cd ~/Documents/sentineliq
source venv/bin/activate
cd backend
pytest -q

Run backend linting:

cd ~/Documents/sentineliq
source venv/bin/activate
ruff check backend

Run frontend checks:

cd ~/Documents/sentineliq/frontend
npm run lint
npm run build
Sample Data

Synthetic development data is stored under:

data/sample/

Only synthetic or non-confidential data should be committed.

Do not commit:

real client or trading data;
internal bank records;
confidential surveillance scenarios;
proprietary Oracle Mantas materials;
interview materials;
credentials or API keys.
Git Workflow

Branches:

main
develop
feature/*

Examples:

feature/data-platform
feature/scenario-administration
feature/spoofing-detector

Commit convention:

feat(scope): description
fix(scope): description
docs(scope): description
test(scope): description
refactor(scope): description
chore(scope): description

Example:

git commit -m "feat(data-platform): add enterprise dataset explorer"
Roadmap
Data Platform
 CSV ingestion
 upload metadata
 dataset profiling
 quality scoring
 dataset explorer
 configurable data-quality rules
 exception records
 dataset catalogue
 lineage visualisation
 additional connectors
Canonical Trading Model
 orders
 order events
 executions
 trades
 instruments
 accounts
 traders
 venues
 market data
Scenario Administration
 scenario catalogue
 configurable parameters
 asset-class applicability
 business and desk scope
 exclusions and suppressions
 scenario versioning
 maker-checker approval
 test-to-production promotion
 configuration audit trail
Surveillance
 spoofing
 layering
 wash trading
 marking the close
 front running
 momentum ignition
 insider dealing
 cross-product manipulation
Investigation
 risk-ranked alert queue
 evidence timeline
 order and execution reconstruction
 trader profile
 case management
 audit history
 AI investigation summaries
 investigation reports
Security and Confidentiality

This repository must contain only independently authored and non-confidential material.

Concepts may be informed by professional knowledge and publicly known regulatory requirements, but proprietary documentation, internal employer content and confidential configuration values must not be copied into the repository.

Secrets must be stored in local environment files and never committed.

Use:

.env

Provide only safe templates through:

.env.example
Regulatory Context

SentinelIQ is intended to support surveillance workflows relevant to regulations and controls such as:

UK Market Abuse Regulation;
EU Market Abuse Regulation;
MiFID II;
FCA market conduct requirements;
SEC and FINRA market-manipulation controls.

Regulatory mappings will require formal legal and compliance review before any production use.

Repository
https://github.com/Ahneesh/sentineliq
License

No open-source licence has yet been selected.

Unless a licence is added, the repository should not be assumed to grant permission for reuse, modification or redistribution.
