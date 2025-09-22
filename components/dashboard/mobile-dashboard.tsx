import React from 'react';

export const MobileDashboard: React.FC = () => {
  return (
    <div className="bg-red-500 p-5 m-2.5">
      <h1>Mobile Dashboard</h1>
      <div className="border border-black w-full h-50">
        Content here
      </div>
      <button className="text-blue-500 text-base">
        Click me
      </button>
    </div>
  );
};

export const MobileCard: React.FC = () => {
  return (
    <div className="bg-yellow-400 rounded-lg p-4">
      Mobile Card
    </div>
  );
};

export const TouchButton: React.FC = () => {
  return (
    <button className="bg-green-500 border-none py-2.5 px-5">
      Touch Button
    </button>
  );
};