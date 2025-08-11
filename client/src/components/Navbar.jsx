import { NavLink, useNavigate, useLocation } from 'react-router-dom';

function Navbar({ loginUserId, setLoginUserId }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    setLoginUserId('');
    navigate('/');
  };

  const navLinks = [
    { to: '/', text: 'Home' },
    { to: '/dashboard', text: 'Dashboard' },
    { to: '/bookings', text: 'My Bookings' },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and App Name */}
          <NavLink to="/" className="text-2xl font-extrabold text-white flex items-center gap-2 transition-colors duration-300 hover:text-yellow-400">
            <span className="text-yellow-400">🚗</span> Find My Space
          </NavLink>

          {/* Navigation Links and Buttons */}
          <div className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink 
                key={link.to} 
                to={link.to} 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 
                   ${isActive ? 'bg-gray-700 text-white' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`
                }
              >
                {link.text}
              </NavLink>
            ))}

            {/* Conditional Sign In/Sign Out Buttons */}
            {loginUserId ? (
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 shadow-md"
              >
                Sign Out
              </button>
            ) : (
              <NavLink 
                to="/signin" 
                className="border-2 border-white text-white py-2 px-4 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors duration-300 shadow-md"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;