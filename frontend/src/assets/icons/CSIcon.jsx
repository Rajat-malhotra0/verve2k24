import React from "react";

const CSIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg" 
    className="h-16 w-16"
    viewBox="0 0 64 64" 
    fill="white"
  >
    {/* Screen */}
    <rect x="8" y="12" width="48" height="32" fill="none" stroke="white" strokeWidth="3" />
    {/* Base/keyboard */}
    <rect x="16" y="44" width="32" height="8" fill="none" stroke="white" strokeWidth="3" />
    <line x1="8" y1="44" x2="56" y2="44" stroke="white" strokeWidth="3" />
  </svg>
);

export default CSIcon;