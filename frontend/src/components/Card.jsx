import React from "react";
import { Link } from "react-router-dom";

function Card(props) {
  return (
    <div className="max-w-xs w-full rounded-xl overflow-hidden shadow-lg bg-white transform hover:scale-105 transition-transform duration-300">
      <div className={`w-full h-48 ${props.bgColor} flex items-center justify-center`}>
        {props.logo}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-center text-gray-800">{props.title}</h3>
        <div className="flex gap-4 mt-6">
          <Link
            to={`/bot/${props.title}`}
            className="flex-1 bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            AI Bot
          </Link>
          <Link
            to={`/forum/${props.title}`}
            className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Forum
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;