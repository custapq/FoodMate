import React from "react";

const FoodCard = ({ food }) => {
  if (!food) {
    return <div>Loading...</div>;
  }

  const { thaiName, englishName, imageURL, nutrientList, foodTagList } = food;
  const energy = nutrientList.find((item) => item.nutrientId === 1);

  return (
    <div className="w-96 h-96 border border-gray-200 rounded-lg shadow-md p-4 flex-shrink-0">
      <img
        src={imageURL}
        alt={thaiName}
        className="w-full h-3/6 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-2 ">
        {thaiName} / {englishName}
      </h2>
      <p className="text-gray-600">
        Energy: {energy ? `${energy.amount} ${energy.unit}` : "N/A"}
      </p>

      <div className="mt-2 flex flex-wrap">
        {foodTagList.map((tag) => (
          <span
            key={tag.foodTag.id}
            className="inline-block bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
          >
            {tag.foodTag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FoodCard;
