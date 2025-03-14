const Button = ({ type, onClick, children, className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`mt-5 text-white bg-orange-500 hover:bg-orange-800 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-lg w-full px-8 py-4 text-center dark:bg-orange-500 dark:hover:bg-orange-700 dark:focus:ring-orange-800 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
