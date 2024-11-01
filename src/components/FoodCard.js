import React, { useEffect, useState } from "react";

const FoodCard = ({ food }) => {
  // const [image, setImage] = useState(null);

  // useEffect(() => {
  //   if (food.imageURL) {
  //     setImage(food.imageURL);
  //   }
  // }, [food.imageURL]);

  if (!food) {
    return <div>Loading...</div>;
  }

  const { thaiName, englishName, imageURL, nutrientList, foodTagList } = food;
  // console.log("Image URL:", imageURL);
  const energy = nutrientList.find((item) => item.nutrientId === 1);
  return (
    <div
      className="border border-gray-200 rounded-lg shadow-md p-4
      w-60 h-92 sm:w-60 sm:h-92 mx-4"
    >
      <img
        src={imageURL}
        alt={thaiName}
        className="w-full h-32 sm:h-48 object-cover rounded-md border-gray-800"
      />
      <h2 className="text-md font-semibold mt-2 sm:text-sm">{thaiName}</h2>
      <p className="text-gray-600">
        Energy: {energy ? `${energy.amount} ${energy.unit}` : "N/A"}
      </p>

      <div className="mt-2 flex-wrap hidden sm:flex">
        {foodTagList.map((tag) => (
          <span
            key={tag.foodTag.id}
            className="gird grid-cols-3 bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
          >
            {tag.foodTag.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FoodCard;
