import React from "react";

function Card(props) {
  return (
    <div className="max-w-md rounded-lg overflow-hidden shadow-xl bg-white transform hover:scale-105 transition duration-300">
      <div className={`w-full h-40 ${props.bgColor} flex items-center justify-center`}>
        {props.logo}
      </div>
      <div className="p-6">
        <div className="font-bold text-2xl mb-4 text-gray-800">{props.title}</div>
        <div className="flex justify-between">
          <button className="bg-blue-500 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition duration-300">
            AI Bot
          </button>
          <button className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-700 transition duration-300">
            Forum
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;