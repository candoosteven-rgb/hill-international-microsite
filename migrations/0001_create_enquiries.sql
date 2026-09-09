CREATE TABLE IF NOT EXISTS enquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  regions TEXT,
  motivation TEXT,
  budget TEXT,
  preferred_language TEXT,
  development_id TEXT,
  development_name TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  page_lang TEXT,
  user_agent TEXT
);
