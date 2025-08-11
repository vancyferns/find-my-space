import {API_BASE_URL} from "../config";

export async function getEvents() {
  const res = await fetch(`${API_BASE_URL}/events`);
    return await res.json();
    }

    export async function getParking() {
      const res = await fetch(`${API_BASE_URL}/parking`);
        return await res.json();
        }

        export async function getBookings() {
          const res = await fetch(`${API_BASE_URL}/bookings`);
            return await res.json();
            }

            export async function saveBookings(newBooking) {
              const res = await fetch(`${API_BASE_URL}/bookings`, {
                  method: "POST",
                      headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(newBooking),
                            });
                              return await res.json();
                              }
                              