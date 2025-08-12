import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard({ parkingSpots, locations }) {
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const navigate = useNavigate();

  const filteredParking = selectedLocationId
    ? parkingSpots.filter(p => p.locationId === selectedLocationId)
    : parkingSpots;

  if (parkingSpots.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Parking Spots...</h2>
        <p className="text-gray-500">Please wait while we fetch available spots.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center font-sans text-gray-800">
      <div className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-2">
          Find Your Parking Spot
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Browse available parking spots and book your space in seconds.
        </p>

        {/* Location Filter */}
        <div className="flex items-center gap-3 p-4 mb-6 bg-gray-50 rounded-lg">
          <label htmlFor="location-select" className="font-semibold text-gray-700 whitespace-nowrap">
            Filter by Location:
          </label>
          <select
            id="location-select"
            className="w-full sm:w-auto p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
          >
            <option value="">All locations</option>
            {locations.map(loc => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* Parking Spots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredParking.length > 0 ? (
            filteredParking.map((spot) => (
              <div key={spot.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">{spot.name}</h3>
                <p className="text-sm text-gray-500">
                  Location: {spot.locationId ? locations.find(l => l.id === spot.locationId)?.name : 'N/A'}
                </p>
                <div className="mt-2 text-sm">
                  <span className="font-medium text-gray-700">Total Slots:</span> {spot.slots}
                </div>
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Available:</span> {spot.available}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/book/${spot.id}`)}
                    disabled={spot.available === 0}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors
                      ${spot.available > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {spot.available > 0 ? 'Book Now' : 'Full'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No parking spots found for this location.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
