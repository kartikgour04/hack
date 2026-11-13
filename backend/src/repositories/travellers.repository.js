import { db } from '../db/connection.js';

const countStmt = db.prepare('SELECT COUNT(*) AS count FROM travellers');

const insertStmt = db.prepare(`
  INSERT INTO travellers (traveller_id, name, email, age, gender, home_city, gender_preference)
  VALUES (@traveller_id, @name, @email, @age, @gender, @home_city, @gender_preference)
`);

const insertInterestStmt = db.prepare(
  'INSERT INTO traveller_interests (traveller_id, interest) VALUES (?, ?)',
);

export function countTravellers() {
  return countStmt.get().count;
}

export function insertTraveller({ traveller_id, name, email, age, gender, home_city, gender_preference }) {
  insertStmt.run({ traveller_id, name, email, age, gender, home_city, gender_preference });
}

export function insertInterests(travellerId, interests) {
  for (const interest of interests) insertInterestStmt.run(travellerId, interest);
}
