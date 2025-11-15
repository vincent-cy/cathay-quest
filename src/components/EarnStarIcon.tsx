import React from "react";

interface EarnStarIconProps {
  className?: string;
  strokeWidth?: number;
}

export const EarnStarIcon: React.FC<EarnStarIconProps> = ({ 
  className = "", 
  strokeWidth = 2 
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Stylized geometric star with rounded look - consistent with Naevv icon style */}
      <path
        d="M12 3L14.5 9L21 10.5L14.5 12L12 18L9.5 12L3 10.5L9.5 9L12 3Z"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <path
        d="M12 3L14.5 9L21 10.5L14.5 12L12 18L9.5 12L3 10.5L9.5 9L12 3Z"
        fill="none"
      />
    </svg>
  );
};

