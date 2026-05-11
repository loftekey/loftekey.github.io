import React from 'react';
import type { Phase } from '../config/types';

interface PositionPillsProps {
  phase: Phase;
  primaryLabel: string;
  secondaryLabel: string | null;
  onPrimaryHover: () => void;
  onSecondaryHover: () => void;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  onMouseLeave: () => void;
}

const PositionPills: React.FC<PositionPillsProps> = ({
  phase, primaryLabel, secondaryLabel,
  onPrimaryHover, onSecondaryHover,
  onPrimaryClick, onSecondaryClick, onMouseLeave,
}) => (
  <div className="pos">
    <div
      className="pill clickable"
      onMouseEnter={onPrimaryHover}
      onMouseLeave={onMouseLeave}
      onClick={onPrimaryClick}
    >
      {primaryLabel}
    </div>
    {(phase === 'mysteryLoop') && secondaryLabel && (
      <div
        className="pill clickable"
        onMouseEnter={onSecondaryHover}
        onMouseLeave={onMouseLeave}
        onClick={onSecondaryClick}
      >
        {secondaryLabel}
      </div>
    )}
  </div>
);

export default PositionPills;
