import { db } from '../db/connection.js';

const insertStmt = db.prepare(`
  INSERT INTO groups (group_id, name, owner_id, city, check_in, check_out, max_size, budget_inr, itinerary)
  VALUES (@group_id, @name, @owner_id, @city, @check_in, @check_out, @max_size, @budget_inr, @itinerary)
`);

const insertMemberStmt = db.prepare('INSERT INTO group_members (group_id, traveller_id) VALUES (?, ?)');

export function insertGroup({ group_id, name, owner_id, city, check_in, check_out, max_size, budget_inr, itinerary }) {
  insertStmt.run({ group_id, name, owner_id, city, check_in, check_out, max_size, budget_inr, itinerary });
}

export function insertMember(groupId, travellerId) {
  insertMemberStmt.run(groupId, travellerId);
}
