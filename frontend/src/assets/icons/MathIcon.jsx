import React from "react";

const MathIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-16 w-16"
    viewBox="0 0 64 64"
    fill="white"
  >
    {/* Plus operator (top-left quadrant) */}
    <rect x="8" y="15" width="16" height="3" />
    <rect x="15" y="8" width="3" height="16" />

    {/* Minus operator (top-right quadrant) */}
    <rect x="40" y="15" width="16" height="3" />

    {/* Multiplication operator (bottom-left quadrant) */}
    {/* Re-centered using (16,48) as the pivot, with width=16 and height=3 */}
    <rect x="8" y="46.5" width="16" height="3" transform="rotate(45 16 48)" />
    <rect x="8" y="46.5" width="16" height="3" transform="rotate(-45 16 48)" />

    {/* Division operator (bottom-right quadrant) */}
    <rect x="40" y="47" width="16" height="3" />
    <circle cx="48" cy="42" r="2" />
    <circle cx="48" cy="54" r="2" />
  </svg>
);

export default MathIcon;