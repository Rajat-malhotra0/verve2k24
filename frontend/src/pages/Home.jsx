import React from "react";
import Card from "../components/Card";
import MathIcon from "../assets/icons/MathIcon";
import PhysicsIcon from "../assets/icons/PhysicsIcon";
import CSIcon from "../assets/icons/CSIcon";
import EnglishIcon from "../assets/icons/EnglishIcon";

function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-wrap justify-center gap-6">
        <Card
          title="Mathematics"
          bgColor="bg-gradient-to-tr from-[#4facfe] to-[#00f2fe]"
          logo={<MathIcon />}
        />
        <Card
          title="Physics"
          bgColor="bg-gradient-to-tr from-[#43e97b] to-[#38f9d7]"
          logo={<PhysicsIcon />}
        />
        <Card
          title="Computer Science"
          bgColor="bg-gradient-to-tr from-[#fa709a] to-[#fee140]"
          logo={<CSIcon />}
        />
        <Card
          title="English"
          bgColor="bg-gradient-to-tr from-[#f093fb] to-[#f5576c]"
          logo={<EnglishIcon />}
        />
      </div>
    </main>
  );
}

export default Home;