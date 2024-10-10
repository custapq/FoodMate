import React from "react";

const Card = ({ title, value, detail }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-xl">{value}</p>
      <p className="text-gray-600">{detail}</p>
    </div>
  );
};

export default Card;
