// small seeding helper that stores sample events/parking into localStorage
const EVENTS_KEY = "fms_events";
const PARKING_KEY = "fms_parking";
const BOOKINGS_KEY = "fms_bookings";

const sampleEvents = [
  { id: "e1", name: "Sunburn", location: "Vagator", date: "2025-12-01", times: ["18:00-22:00"] },
  { id: "e2", name: "Goa Carnival", location: "Panaji", date: "2025-02-15", times: ["10:00-23:00"] },
];

const sampleParking = [
  { id: "p1", name: "Vagator Field", address: "Near Vagator Beach", eventId: "e1", slots: 40, available: 35, pricePerHour: 100 },
  { id: "p2", name: "Anjuna Lot", address: "Anjuna Market", eventId: "e1", slots: 20, available: 0, pricePerHour: 80 },
  { id: "p3", name: "Panaji Church Lot", address: "Panaji", eventId: "e2", slots: 25, available: 12, pricePerHour: 60 },
];

export function seedIfNeeded() {
  if (!localStorage.getItem(EVENTS_KEY)) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(sampleEvents));
  }
  if (!localStorage.getItem(PARKING_KEY)) {
    localStorage.setItem(PARKING_KEY, JSON.stringify(sampleParking));
  }
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
  }
}

export function getEvents() {
  return JSON.parse(localStorage.getItem(EVENTS_KEY) || "[]");
}
export function getParking() {
  return JSON.parse(localStorage.getItem(PARKING_KEY) || "[]");
}
export function saveParking(arr) {
  localStorage.setItem(PARKING_KEY, JSON.stringify(arr));
}
export function getBookings() {
  return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
}
export function saveBookings(arr) {
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(arr));
}

