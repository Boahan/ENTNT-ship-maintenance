import React from 'react';
import { Anchor } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-center">
        <Anchor className="h-16 w-16 text-teal-500 mx-auto animate-pulse" />
        <h1 className="mt-4 text-2xl font-semibold text-white">ENTNT Marine</h1>
        <p className="mt-2 text-gray-400">Loading application...</p>
        <div className="mt-4 w-16 h-1 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div 
            className="h-full bg-teal-500 animate-[loading_1.5s_ease-in-out_infinite]"
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;