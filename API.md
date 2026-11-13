# API reference

Base URL: `http://localhost:4000/api` (in the browser, Vite forwards `/api` and `/images` to the backend).
All requests and responses are JSON. Money is whole INR. Dates are `YYYY-MM-DD`, local to the destination city.

This file grows with every stage. Each endpoint has one example request and response.

## Conventions

### Errors

Every error has the same shape and one of these codes:

| HTTP | `code` | When |
|---|---|---|
| 400 | `VALIDATION` | Missing or invalid input (bad date, unknown city, invalid JSON) |
| 403 | `FORBIDDEN` | You are not allowed to do this (for example, not a member) |
| 404 | `NOT_FOUND` | The thing or the endpoint does not exist |
| 409 | `CONFLICT` | The action clashes with the current state (group full, already booked) |
| 500 | `INTERNAL` | Unexpected server bug (should never happen in the demo) |

```json
{ "error": { "code": "NOT_FOUND", "message": "There is no API endpoint GET /api/nope" } }
```

### Current user

From Stage 1, the frontend sends the logged-in traveller's id in the `X-User-Id` header on every request.

---

## GET /api/meta

Everything the forms need: destination cities, interest tags, home cities and the valid date window.
All values come from the read-only data pack (`destinations.json`, `interests.json`).

`date_window`: `check_in` must be on or after `first_check_in`; `check_out` must be on or before
`last_check_out`. The `last_check_out` day itself is never a night.

**Request**

```http
GET /api/meta
```

**Response 200** (interests shortened to 3 of 16)

```json
{
  "cities": [
    { "name": "Tokyo", "country": "Japan", "timezone": "Asia/Tokyo" },
    { "name": "Kyoto", "country": "Japan", "timezone": "Asia/Tokyo" },
    { "name": "Osaka", "country": "Japan", "timezone": "Asia/Tokyo" },
    { "name": "Dubai", "country": "United Arab Emirates", "timezone": "Asia/Dubai" },
    { "name": "Abu Dhabi", "country": "United Arab Emirates", "timezone": "Asia/Dubai" }
  ],
  "interests": [
    { "interest": "TEMPLES", "label": "Temples and shrines", "category": "CULTURE" },
    { "interest": "STREET_FOOD", "label": "Street food and markets", "category": "FOOD" },
    { "interest": "PHOTOGRAPHY", "label": "Photography", "category": "HOBBY" }
  ],
  "home_cities": [
    { "city": "Bengaluru", "airport": "BLR" },
    { "city": "Delhi", "airport": "DEL" },
    { "city": "Mumbai", "airport": "BOM" },
    { "city": "Chennai", "airport": "MAA" }
  ],
  "date_window": { "first_check_in": "2027-04-01", "last_check_out": "2027-04-20" }
}
```

---

## GET /images/...

Hotel photos from the data pack, served as static files (not under `/api`).
A hotel's `image` field (for example `images/hotels/HOTEL-BUSINESS-1.jpg`) becomes the URL
`/images/hotels/HOTEL-BUSINESS-1.jpg`.
