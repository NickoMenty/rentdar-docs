import React from 'react';

export default function InTag({ children, color }) {
  return (
    <span
      style={{
        backgroundColor: color,
        borderRadius: '4px',
        color: '#fff',
        padding: '0.1rem 0.1rem',
        fontWeight: 'bold',
      }}
    >
      {children}
    </span>
  );
}