import React from "react";

const Card = ({ formattedDate, list, tag }) => {
  const arr = {
    coding: "bg-blue-500 text-red-300",
    development: "bg-green-500 text-white",
    study: "bg-yellow-500 text-black",
    work: "bg-red-500 text-white",
  };

  return (
    <div className="bg-primary-dark overflow-hidden p-6 rounded-lg shadow-white-soft mb-6 container max-w-[300px] min-h-[250px] hover:scale-105">
      <h2 className="text-white text-2xl mb-4 ">DAY {formattedDate}</h2>

      <ul className="text-white ml-5">
        {list.map((item, index) => (
          <li key={index} className="text-white text-sm list-disc">
            {item}
          </li>
        ))}
      </ul>
      <div className="p-1 mt-3 space-x-2 flex flex-wrap">
        {tag.map((item, index) => (
          <span
            key={index}
            className={`p-1 rounded-md text-white text-sm font-bold ${arr[item]} mb-2 mr-2`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Card;
