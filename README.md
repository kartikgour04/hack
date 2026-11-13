# Group Travel Matcher

Solo travellers create a group trip post or find one that matches them, ask to join, and once approved,
plan and split one hotel booking together on a shared group page.

Runs fully on localhost. No external APIs and no AI calls inside the app.

> Work in progress: built in stages. This README is completed in Stage 5.

## Quick start

Needs Node.js 20 or newer.

```bash
npm run setup
npm start
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api

Other commands:

| Command | What it does |
|---|---|
| `npm run reset` | Deletes the database and loads the 24 travellers and 12 groups again (stop the app first) |
| `npm test` | Runs the backend unit tests |

## Stack

React (Vite) frontend, Node.js + Express backend, SQLite (better-sqlite3). Plain JavaScript and CSS.

The files in `data/` are the read-only data pack (see `data/DATA_DICTIONARY.md`). The backend loads them into memory
at start. Everything the app creates (profiles, groups, requests, bookings, messages) is stored in
`backend/travel.db`, which is created and seeded automatically on first start.
