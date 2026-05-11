import React, { useState, useEffect, useRef } from 'react';
import type { RosaryConfig } from '../config/types';

interface SettingsModalProps {
  open: boolean;
  config: RosaryConfig;
  onClose: () => void;
  onSaveApply: (cfg: RosaryConfig) => void;
  onRestoreDefault: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, config, onClose, onSaveApply, onRestoreDefault }) => {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setText(JSON.stringify(config, null, 2));
      setMsg('');
      setTimeout(() => editorRef.current?.focus(), 50);
    }
  }, [open, config]);

  const handleSaveApply = () => {
    try {
      const parsed = JSON.parse(text);
      onSaveApply(parsed);
      setMsg('已保存并应用。');
    } catch (e: any) {
      setMsg('JSON 解析失败：' + e.message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSaveApply();
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(text);
      setMsg('校验通过。');
    } catch (e: any) {
      setMsg('JSON 解析失败：' + e.message);
    }
  };

  const handleExport = () => {
    const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rosary_config.json';
    a.click();
    URL.revokeObjectURL(url);
    setMsg('已导出 rosary_config.json。');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setText(String(reader.result || ''));
        setMsg('已导入到编辑器（尚未保存应用）。');
      };
      reader.readAsText(file, 'utf-8');
    };
    input.click();
  };

  if (!open) return null;

  return (
    <div className="modal-mask show" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="m-head">
          <div className="m-title">配置（JSON）</div>
          <button className="btn" onClick={onClose}>关闭</button>
        </div>
        <div className="m-body">
          <div className="note">
            说明：配置与进度存储在浏览器 localStorage。可自定义颜色、经文、星期映射、补充经文。<br />
            快捷键：<span className="kbd">Esc</span> 关闭；<span className="kbd">Ctrl</span> + <span className="kbd">Enter</span> 保存并应用。
          </div>
          <textarea ref={editorRef} value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKeyDown} spellCheck={false} />
          <div className="m-row">
            <button className="btn" onClick={handleValidate}>校验 JSON</button>
            <button className="btn" onClick={handleExport}>导出 JSON</button>
            <button className="btn" onClick={handleImport}>导入 JSON</button>
            <button className="btn" onClick={onRestoreDefault}>恢复默认</button>
            <button className="btn primary" onClick={handleSaveApply}>保存并应用</button>
          </div>
          <div className="note">{msg}</div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
