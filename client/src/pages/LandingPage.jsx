import { NavLink } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gray-800 text-white rounded-lg shadow-lg max-w-7xl mx-auto mt-8 mb-12 px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">Find My Space</h1>
        <p className="text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto">
          The smart parking platform for event-goers and locals. Find your spot, fast.
        </p>
        <NavLink
          to="/dashboard"
          className="inline-block border-2 border-white text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-white hover:text-gray-800 transition-colors duration-300 shadow-md"
        >
          Find a Spot
        </NavLink>
      </section>

      {/* How It Works Section */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
            <span className="text-5xl text-blue-500 mb-4 inline-block">📍</span>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Find a Spot</h3>
            <p className="text-gray-600">Easily discover pre-verified parking spots near your event or location.</p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
            <span className="text-5xl text-green-500 mb-4 inline-block">💸</span>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Book & Pay</h3>
            <p className="text-gray-600">Reserve your space with a simple click and pay securely.</p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
            <span className="text-5xl text-red-500 mb-4 inline-block">🚗</span>
            <h3 className="text-2xl font-bold mb-2 text-gray-800">Park & Go</h3>
            <p className="text-gray-600">Get turn-by-turn directions and park with peace of mind.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;