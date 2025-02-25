//// filepath: /workspaces/verve2k24/frontend/src/assets/icons/PhysicsIcon.jsx
import React from "react";

const PhysicsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    viewBox="0 0 64 64"
    fill="none"
  >
    {/* Sun at the center */}
    <circle cx="32" cy="32" r="4" fill="white" />

    {/* Inner orbit (smaller) */}
    <ellipse
      cx="32"
      cy="32"
      rx="12"
      ry="7"
      stroke="white"
      strokeWidth="3"
      fill="none"
    />
    {/* Planet on inner orbit */}
    <circle cx="44" cy="32" r="2.5" fill="white" />

    {/* Middle orbit (expanded) */}
    <ellipse
      cx="32"
      cy="32"
      rx="22"
      ry="11"
      stroke="white"
      strokeWidth="3"
      fill="none"
    />
    {/* Planet on middle orbit */}
    <circle cx="54" cy="32" r="3" fill="white" />

    {/* Outer orbit (expanded further) */}
    <ellipse
      cx="32"
      cy="32"
      rx="30"
      ry="15"
      stroke="white"
      strokeWidth="3"
      fill="none"
    />
    {/* Planet on outer orbit */}
    <circle cx="32" cy="17" r="2.5" fill="white" />
  </svg>
);

export default PhysicsIcon;