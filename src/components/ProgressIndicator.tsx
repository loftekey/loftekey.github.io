import React from 'react';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  pct: number;
  visible: boolean;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ current, total, pct, visible }) => (
  <div className="progress" style={{ display: visible ? 'flex' : 'none' }}>
    <div className="meta">
      <div>{current}/{total}</div>
      <div>{pct}%</div>
    </div>
    <div className="bar">
      <div style={{ width: `${pct}%` }}></div>
    </div>
  </div>
);

export default ProgressIndicator;
