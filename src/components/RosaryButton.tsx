import React from 'react';

interface RosaryButtonProps {
  label: string;
  color: string;
  onClick: () => void;
}

const RosaryButton: React.FC<RosaryButtonProps> = ({ label, color, onClick }) => (
  <div className="center">
    <button
      className="rosary-btn"
      onClick={onClick}
      aria-label={label}
      style={{ '--btn-color': color } as React.CSSProperties}
    >
      <div className="btn-label">{label}</div>
    </button>
  </div>
);

export default RosaryButton;
