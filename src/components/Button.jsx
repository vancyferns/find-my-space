function Button({ children, onClick, type = "button", className = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
