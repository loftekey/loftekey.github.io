import React from 'react';

interface PrayerTooltipProps {
  visible: boolean;
  pinned: boolean;
  title: string;
  body: string;
  onTogglePin: () => void;
}

const PrayerTooltip: React.FC<PrayerTooltipProps> = ({ visible, pinned, title, body, onTogglePin }) => (
  <div className={`tooltip${visible || pinned ? ' show' : ''}`}>
    <div className="tt-head">
      <div className="tt-title">{title}</div>
      <button className="tt-pin" onClick={onTogglePin}>
        {pinned ? '取消固定' : '固定'}
      </button>
    </div>
    <div className="tt-body">{body}</div>
  </div>
);

export default PrayerTooltip;
