import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';

// Reads one JSON file from the read-only data pack. Nothing here ever writes to it.
export function readDataFile(relativePath) {
  return deepFreeze(JSON.parse(fs.readFileSync(path.join(config.dataDir, relativePath), 'utf8')));
}

// Frozen objects throw if code tries to change them, so the catalog stays read-only in memory too.
function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    Object.freeze(value);
  }
  return value;
}

function groupBy(items, key) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item[key])) map.set(item[key], []);
    map.get(item[key]).push(item);
  }
  return map;
}

// Loaded once when the backend starts.
const destinations = readDataFile('catalog/destinations.json');
const interests = readDataFile('problem-3/interests.json');
const hotels = readDataFile('catalog/hotels.json');
const rooms = readDataFile('catalog/rooms.json');
const availability = readDataFile('catalog/availability.json');

const cities = destinations.countries.flatMap((country) =>
  country.cities.map((city) => ({ name: city.name, country: country.name, timezone: country.timezone })),
);
const homeCities = destinations.departure_cities.map(({ city, airport }) => ({ city, airport }));
const dateWindow = {
  first_check_in: destinations.rules.data_window.first_night,
  last_check_out: destinations.rules.data_window.last_departure,
};

const cityByName = new Map(cities.map((city) => [city.name, city]));
const homeCityByName = new Map(homeCities.map((home) => [home.city, home]));
const interestById = new Map(interests.map((item) => [item.interest, item]));
const hotelById = new Map(hotels.map((hotel) => [hotel.hotel_id, hotel]));
const roomById = new Map(rooms.map((room) => [room.room_id, room]));
const hotelsByCity = groupBy(hotels, 'city');
const roomsByHotel = groupBy(rooms, 'hotel_id');
const roomsLeftByRoomAndDate = new Map(availability.map((a) => [`${a.room_id}|${a.date}`, a.rooms_left]));

export const listCities = () => cities;
export const findCity = (name) => cityByName.get(name);

export const listHomeCities = () => homeCities;
export const findHomeCity = (name) => homeCityByName.get(name);

export const listInterests = () => interests;
export const findInterest = (id) => interestById.get(id);

export const getDateWindow = () => dateWindow;

export const findHotel = (hotelId) => hotelById.get(hotelId);
export const findRoom = (roomId) => roomById.get(roomId);
export const listHotelsInCity = (city) => hotelsByCity.get(city) ?? [];
export const listRoomsOfHotel = (hotelId) => roomsByHotel.get(hotelId) ?? [];

// A night with no availability record counts as sold out.
export const getRoomsLeft = (roomId, date) => roomsLeftByRoomAndDate.get(`${roomId}|${date}`) ?? 0;
