import ParkingCard from "../components/parkingcard";

function Dashboard() {
  const parkingSpaces = [
    { id: 1, name: "City Center Parking", location: "MG Road, Pune", price: 50, available: true },
    { id: 2, name: "Mall Parking", location: "Phoenix Marketcity", price: 80, available: false },
    { id: 3, name: "Airport Parking", location: "Lohegaon", price: 100, available: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Available Parking Spaces</h1>
      <div className="flex flex-wrap gap-6">
        {parkingSpaces.map((space) => (
          <ParkingCard key={space.id} {...space} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
