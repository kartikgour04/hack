import { readDataFile } from '../catalog/catalogStore.js';
import { runInTransaction } from './connection.js';
import * as travellersRepo from '../repositories/travellers.repository.js';
import * as groupsRepo from '../repositories/groups.repository.js';

// Loads the 24 travellers and 12 groups from the data pack into an empty database.
// Returns what was inserted, or null when the database already has data.
export function seedIfEmpty() {
  if (travellersRepo.countTravellers() > 0) return null;

  const travellers = readDataFile('problem-3/travellers.json');
  const groups = readDataFile('problem-3/groups.json');

  runInTransaction(() => {
    const usedEmails = new Set();
    for (const traveller of travellers) {
      travellersRepo.insertTraveller({ ...traveller, email: makeSeedEmail(traveller.name, usedEmails) });
      travellersRepo.insertInterests(traveller.traveller_id, traveller.interests);
    }
    for (const group of groups) {
      groupsRepo.insertGroup(group);
      for (const memberId of group.member_ids) groupsRepo.insertMember(group.group_id, memberId);
    }
  });

  return { travellers: travellers.length, groups: groups.length };
}

// The data pack has no emails, so seeded travellers get "first.last@example.com".
// A number is added if two people would get the same address.
function makeSeedEmail(name, usedEmails) {
  const words = name.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(Boolean);
  const base = words.length > 1 ? `${words[0]}.${words.at(-1)}` : words[0];
  let email = `${base}@example.com`;
  for (let n = 2; usedEmails.has(email); n += 1) email = `${base}${n}@example.com`;
  usedEmails.add(email);
  return email;
}
