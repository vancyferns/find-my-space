import React from "react";
import ParkingCard from "./ParkingCard";

export default function EventList({ parking = [], events = [] }) {
  if (parking.length === 0) {
    return <div>No parking spots yet. Add one from "Add Parking".</div>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
        gap: 12
      }}
    >
      {parking.map((p) => (
        <ParkingCard
          key={p.id || p._id} // handle both localStorage id and MongoDB _id
          spot={p}
        />
      ))}
    </div>
  );
}
