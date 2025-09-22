import React from 'react';

export const MagneticButton: React.FC = () => {
  return (
    <button
      style={{ backgroundColor: 'purple', color: 'white', padding: '12px 24px', borderRadius: '25px' }}
      aria-hidden="{expression}"
    >
      Magnetic Button
    </button>
  );
};

export const AnotherButton: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button style={{ fontSize: '18px', fontWeight: 'bold', margin: '5px' }}>
        Another Button
      </button>
    </div>
  );
};

export const ThirdButton: React.FC = () => {
  return (
    <button style={{ border: '2px solid orange', backgroundColor: 'transparent', padding: '8px 16px' }}>
      Third Button
    </button>
  );
};