-- App-owned data. The catalog (cities, interests, hotels, rooms, availability)
-- stays in the read-only JSON files and is loaded into memory instead.

CREATE TABLE IF NOT EXISTS travellers (
  traveller_id      TEXT PRIMARY KEY,
  name              TEXT NOT NULL,
  email             TEXT NOT NULL UNIQUE,
  age               INTEGER,
  gender            TEXT NOT NULL CHECK (gender IN ('FEMALE', 'MALE')),
  home_city         TEXT NOT NULL,
  gender_preference TEXT NOT NULL CHECK (gender_preference IN ('ANY', 'SAME_GENDER')),
  created_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS traveller_interests (
  traveller_id TEXT NOT NULL REFERENCES travellers (traveller_id),
  interest     TEXT NOT NULL,
  PRIMARY KEY (traveller_id, interest)
);

CREATE TABLE IF NOT EXISTS groups (
  group_id   TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  owner_id   TEXT NOT NULL REFERENCES travellers (traveller_id),
  city       TEXT NOT NULL,
  check_in   TEXT NOT NULL,
  check_out  TEXT NOT NULL,
  max_size   INTEGER NOT NULL CHECK (max_size BETWEEN 2 AND 4),
  budget_inr INTEGER NOT NULL,
  itinerary  TEXT,
  status     TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'BOOKED')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- The owner is a member too (as in groups.json member_ids).
CREATE TABLE IF NOT EXISTS group_members (
  group_id     TEXT NOT NULL REFERENCES groups (group_id),
  traveller_id TEXT NOT NULL REFERENCES travellers (traveller_id),
  joined_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, traveller_id)
);

-- Each seeker search is kept so the form can be prefilled next time.
-- interests is a JSON array of interest ids.
CREATE TABLE IF NOT EXISTS searches (
  search_id         INTEGER PRIMARY KEY AUTOINCREMENT,
  traveller_id      TEXT NOT NULL REFERENCES travellers (traveller_id),
  home_city         TEXT,
  city              TEXT,
  check_in          TEXT,
  check_out         TEXT,
  budget_inr        INTEGER,
  gender            TEXT,
  gender_preference TEXT,
  interests         TEXT,
  created_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS join_requests (
  request_id   INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id     TEXT NOT NULL REFERENCES groups (group_id),
  traveller_id TEXT NOT NULL REFERENCES travellers (traveller_id),
  status       TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  decided_at   TEXT,
  UNIQUE (group_id, traveller_id)
);

-- Costs are a snapshot from when the option was saved; the Saved tab recomputes them live.
CREATE TABLE IF NOT EXISTS saved_options (
  option_id      INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id       TEXT NOT NULL REFERENCES groups (group_id),
  hotel_id       TEXT NOT NULL,
  room_id        TEXT NOT NULL,
  saved_by       TEXT NOT NULL REFERENCES travellers (traveller_id),
  rooms          INTEGER NOT NULL,
  total_inr      INTEGER NOT NULL,
  per_member_inr INTEGER NOT NULL,
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (group_id, room_id, saved_by)
);

-- One booking per group (UNIQUE group_id). It cannot be edited once made.
CREATE TABLE IF NOT EXISTS bookings (
  booking_id     TEXT PRIMARY KEY,
  group_id       TEXT NOT NULL UNIQUE REFERENCES groups (group_id),
  hotel_id       TEXT NOT NULL,
  room_id        TEXT NOT NULL,
  rooms          INTEGER NOT NULL,
  nights         INTEGER NOT NULL,
  member_count   INTEGER NOT NULL,
  total_inr      INTEGER NOT NULL,
  per_member_inr INTEGER NOT NULL,
  booked_by      TEXT NOT NULL REFERENCES travellers (traveller_id),
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id   TEXT NOT NULL REFERENCES groups (group_id),
  sender_id  TEXT NOT NULL REFERENCES travellers (traveller_id),
  body       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
