import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues with some bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function Map({ parkingSpots }) {
  useEffect(() => {
    // Initialize map
    const map = L.map('map').setView([15.3000, 73.8000], 12); // Centered on Goa

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each parking spot
    parkingSpots.forEach(spot => {
      if (spot.available_slots > 0) {
        L.marker([spot.latitude, spot.longitude])
          .addTo(map)
          .bindPopup(
            `<b>${spot.name}</b><br>Available: ${spot.available_slots}`
          );
      }
    });

    // Cleanup function
    return () => {
      map.remove();
    };
  }, [parkingSpots]);

  return <div id="map" style={{ height: '100vh', width: '100%' }}></div>;
}

export default Map;
