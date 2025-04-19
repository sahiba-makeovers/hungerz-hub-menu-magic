
import React from 'react';

const Logo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="text-hungerzblue font-bold text-2xl md:text-3xl flex items-center">
        <span className="flex">
          <span>H</span>
          <span className="text-hungerzorange">H</span>
        </span>
      </div>
      <div className="font-bold text-xl md:text-2xl">
        <span className="text-hungerzblue">Hungerz</span>
        <span className="text-hungerzorange ml-1">Hub</span>
      </div>
    </div>
  );
};

export default Logo;
