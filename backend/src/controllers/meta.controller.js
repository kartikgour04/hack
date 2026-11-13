import { getDateWindow, listCities, listHomeCities, listInterests } from '../catalog/catalogStore.js';

// Everything the forms need for their dropdowns, chips and date limits.
export function getMeta(req, res) {
  res.json({
    cities: listCities(),
    interests: listInterests(),
    home_cities: listHomeCities(),
    date_window: getDateWindow(),
  });
}
