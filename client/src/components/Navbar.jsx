import { BrowserRouter, Routes, Route, NavLink, useNavigate, useParams, useLocation } from 'react-router-dom';
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
    <nav className="bg-gray-900 text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <NavLink to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-yellow-400">🚗</span> Find My Space
          </NavLink>
          <div className="flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                {link.text}
              </NavLink>
            ))}
            {loginUserId ? (
              <button
                onClick={handleSignOut}
                className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            ) : (
              <NavLink to="/signin" className="bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
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