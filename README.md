# Western Suburbs Cricket Club — Fixture Converter

Convert cricket fixture CSV exports into a standardized format for the club's scheduling system.

## What it does

Uploads a raw fixture CSV (Game Date, Game Type, Grade, Teams, etc.), lets you filter grades, configure game duration / attendance / duty roster / ticketing options, previews the output in-browser, and downloads a calendar-ready CSV with event names, time ranges, locations, and metadata.

- Automatic home/away team detection from raw fixture rows
- Multi-grade selection with checkboxes (all-on by default)
- Configurable per-game duration (default 2 hours)
- Optional attendance tracking, comments, duty roster, ticketing
- Before-and-after CSV preview in the browser

## Tech stack

Hybrid full-stack app.

**Frontend** (`wscc-web/`) — Next.js 14, React 18, TypeScript
- axios, csv-parse, csv-stringify, formidable, react-dropzone

**Backend** (`wscc_fixtures/`) — Python + Flask
- pandas (CSV manipulation)
- python-dateutil (date parsing)
- click (CLI)

## Getting started

**Frontend**

```bash
cd wscc-web
npm install
npm run dev            # http://localhost:3000
```

**Backend**

```bash
cd wscc_fixtures
pip install -r requirements.txt
python run.py          # http://localhost:5000
```

Or use the Docker setup:

```bash
docker-compose up
```

## Project structure

```
wscc-web/              Next.js frontend
wscc_fixtures/         Flask backend
scripts/               Utility scripts
template.csv           Reference fixture format
advanced_fixture_*.csv Test fixtures
docs/                  Notes
DEPLOYMENT.md          Deployment guide
```

## Status

Active WIP. Multiple test fixtures in repo; Docker files present.
