import React, { useState, useCallback, useMemo } from 'react';
import TopBar from './components/TopBar';
import RosaryButton from './components/RosaryButton';
import ProgressIndicator from './components/ProgressIndicator';
import PositionPills from './components/PositionPills';
import PrayerTooltip from './components/PrayerTooltip';
import SettingsModal from './components/SettingsModal';
import { useRosary } from './hooks/useRosary';
import { DEFAULT_CONFIG } from './config/defaults';
import { deepClone, tokenColor } from './config/utils';
import { loadConfig, saveConfig, loadProgress, savePinned } from './config/storage';
import type { RosaryConfig } from './config/types';
import './App.css';

const WEEKDAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const App: React.FC = () => {
  const [cfg, setCfg] = useState<RosaryConfig>(() => loadConfig() || deepClone(DEFAULT_CONFIG));
  const [modalOpen, setModalOpen] = useState(false);

  const {
    meta, steps, currentStep,
    buttonColor, progress,
    tooltipPinned, tooltipSource, setTooltipSource,
    makeMysteryInfoText,
    advance, reset, togglePin,
  } = useRosary(cfg);

  // ── tooltip 内容 ──
  const tooltipInfo = useMemo(() => {
    const s = currentStep;
    if (!s) return { title: '', body: '' };

    if (s.phase === 'mysteryLoop') {
      if (tooltipSource === 'primary') {
        const title = `${s.mysterySetName || meta.setName}${s.decadeName || ''}`.trim();
        return { title: title || '奥迹', body: makeMysteryInfoText(s) };
      }
      return { title: s.shortPrayerName || s.label, body: s.text || '' };
    }
    if (s.phase === 'mysteryMeditation') {
      return { title: s.label, body: makeMysteryInfoText(s) || s.text || '' };
    }
    return { title: s.label, body: s.text || '' };
  }, [currentStep, tooltipSource, meta, makeMysteryInfoText]);

  // ── pill 标签 ──
  const pillInfo = useMemo(() => {
    const s = currentStep;
    if (!s) return { primary: '无', secondary: null as string | null };

    if (s.phase === 'nonMystery' || s.phase === 'mysteryMeditation') {
      return { primary: s.label, secondary: null };
    }
    // mysteryLoop
    const primary = `${s.mysterySetName || meta.setName}${s.decadeName || ''}`.trim() || '奥迹';
    return { primary, secondary: s.shortPrayerName || '经文' };
  }, [currentStep, meta]);

  // ── 副标题 ──
  const subtitle = useMemo(() => {
    const d = new Date();
    return `${WEEKDAY_NAMES[d.getDay()]} · 自动选择：${meta.setName}`;
  }, [meta]);

  // ── 按钮文字 ──
  const btnLabel = currentStep?.id === 'complete' ? '完成' : '下一段';

  // ── tooltip 可见性 ──
  const [hovering, setHovering] = useState(false);

  const handleSettingsSave = useCallback((newCfg: RosaryConfig) => {
    setCfg(newCfg);
    saveConfig(newCfg);
    setModalOpen(false);
  }, []);

  const handleRestoreDefault = useCallback(() => {
    if (!window.confirm('确认恢复默认配置？（会覆盖当前自定义 JSON）')) return;
    const d = deepClone(DEFAULT_CONFIG);
    setCfg(d);
    saveConfig(d);
  }, []);

  return (
    <div className="wrap">
      <div className="frame" style={{
        width: cfg.settings.ui.containerMaxWidth
          ? `min(${cfg.settings.ui.containerMaxWidth}px, 92vw)`
          : 'min(560px, 92vw)'
      }}>
        <TopBar
          title="电子玫瑰经"
          subtitle={subtitle}
          onReset={() => reset(true)}
          onSettings={() => setModalOpen(true)}
        />

        <RosaryButton label={btnLabel} color={buttonColor} onClick={advance} />

        <ProgressIndicator
          current={progress.currentHuman}
          total={progress.total}
          pct={progress.pct}
          visible={cfg.settings.ui.showProgressBar}
        />

        <PrayerTooltip
          visible={hovering}
          pinned={tooltipPinned}
          title={tooltipInfo.title}
          body={tooltipInfo.body}
          onTogglePin={togglePin}
        />

        <PositionPills
          phase={currentStep?.phase || 'nonMystery'}
          primaryLabel={pillInfo.primary}
          secondaryLabel={pillInfo.secondary}
          onPrimaryHover={() => { setTooltipSource('primary'); setHovering(true); }}
          onSecondaryHover={() => { setTooltipSource('secondary'); setHovering(true); }}
          onPrimaryClick={() => { setTooltipSource('primary'); togglePin(); }}
          onSecondaryClick={() => { setTooltipSource('secondary'); togglePin(); }}
          onMouseLeave={() => setHovering(false)}
        />

        <SettingsModal
          open={modalOpen}
          config={cfg}
          onClose={() => setModalOpen(false)}
          onSaveApply={handleSettingsSave}
          onRestoreDefault={handleRestoreDefault}
        />
      </div>
    </div>
  );
};

export default App;
