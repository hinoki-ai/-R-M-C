import React from 'react';

export const MobileDashboard: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'red', padding: '20px', margin: '10px' }}>
      <h1>Mobile Dashboard</h1>
      <div style={{ border: '1px solid black', width: '100%', height: '200px' }}>
        Content here
      </div>
      <button style={{ color: 'blue', fontSize: '16px' }}>
        Click me
      </button>
    </div>
  );
};

export const MobileCard: React.FC = () => {
  return (
    <div style={{ backgroundColor: 'yellow', borderRadius: '8px', padding: '15px' }}>
      Mobile Card
    </div>
  );
};

export const TouchButton: React.FC = () => {
  return (
    <button style={{ backgroundColor: 'green', border: 'none', padding: '10px 20px' }}>
      Touch Button
    </button>
  );
};