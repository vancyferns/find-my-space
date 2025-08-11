const Modal = ({ show, onClose, title, children, isSuccess }) => {
  if (!show) return null;

  const titleColor = isSuccess ? 'text-green-700' : 'text-red-700';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className={`relative p-8 border w-96 shadow-lg rounded-md bg-white text-gray-800 ${bgColor}`}>
        <h3 className={`text-xl font-bold mb-4 ${titleColor}`}>{title}</h3>
        <div className="text-sm">
          {children}
        </div>
        <div className="mt-4 text-center">
          <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;