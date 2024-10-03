import { SatelliteDishIcon } from 'lucide-react';
import React from 'react';
 
const AnimatedComponent = () => {
  return (
    <div className="relative z-20 flex items-center text-lg font-medium">
      <SatelliteDishIcon className="h-8 w-8 mr-2 text-blue-500" />
      <span className="animate-fade">Landsat Pulse</span>
    </div>
  );
}

export default AnimatedComponent;
