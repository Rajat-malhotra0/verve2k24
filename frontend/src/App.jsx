import React from "react";
import Navbar from "./components/Navbar";
import Card from "./components/Card";
import MathIcon from "./assets/icons/MathIcon";
import PhysicsIcon from "./assets/icons/PhysicsIcon";
import CSIcon from "./assets/icons/CSIcon";
import EnglishIcon from "./assets/icons/EnglishIcon";

function App() {
    return (
      <div>
        <Navbar />
        <div className="flex flex-wrap gap-4 p-4">
            <Card
                title="Mathematics" 
                bgColor="bg-gradient-to-r from-blue-500 to-blue-300" 
                logo={<MathIcon />} 
            />
            <Card 
                title="Physics" 
                bgColor="bg-gradient-to-r from-purple-100 to-pink-100" 
                logo={<PhysicsIcon />} 
            />
            <Card 
                title="Computer Science" 
                bgColor="bg-gradient-to-r from-yellow-100 to-red-100" 
                logo={<CSIcon />} 
            />
            <Card 
                title="English" 
                bgColor="bg-gradient-to-r from-indigo-100 to-purple-100" 
                logo={<EnglishIcon />} 
            />
        </div>
      </div>
    );
}

export default App;