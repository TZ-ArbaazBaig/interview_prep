const schema = `
CREATE TABLE IF NOT EXISTS sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_title TEXT NOT NULL,
  job_description TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  difficulty TEXT CHECK(difficulty IN ('easy','medium','hard')),
  category TEXT CHECK(category IN ('technical','behavioral','system-design')),
  hint TEXT,
  order_index INTEGER
);

CREATE TABLE IF NOT EXISTS evaluations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  user_answer TEXT NOT NULL,
  ai_score INTEGER CHECK(ai_score BETWEEN 1 AND 10),
  ai_feedback TEXT NOT NULL,
  better_answer TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`;

module.exports = schema;
