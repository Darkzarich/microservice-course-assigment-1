CREATE TABLE
  IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    second_name VARCHAR(255),
    birthdate DATE,
    biography TEXT,
    city VARCHAR(255),
    password VARCHAR(255) NOT NULL
  );

CREATE TABLE
  IF NOT EXISTS messages (
    "from" INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    "to" INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    text TEXT,
    created_at TIMESTAMP DEFAULT NOW ()
  );