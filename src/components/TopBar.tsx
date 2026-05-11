import React from 'react';

interface TopBarProps {
  title: string;
  subtitle: string;
  onReset: () => void;
  onSettings: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ title, subtitle, onReset, onSettings }) => (
  <div className="topbar">
    <div className="title">
      <h1>{title}</h1>
      <div className="sub">{subtitle}</div>
    </div>
    <div className="actions">
      <button className="icon-btn" onClick={onReset} title="重置进度">重置</button>
      <button className="icon-btn" onClick={onSettings} title="编辑 JSON 配置">设置</button>
    </div>
  </div>
);

export default TopBar;
