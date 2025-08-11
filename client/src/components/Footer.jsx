function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 mt-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Find My Space. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;