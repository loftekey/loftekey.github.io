import { useState, useCallback, useMemo } from 'react';
import type { RosaryConfig, Step } from '../config/types';
import { buildSteps, type BuildResult } from '../config/stepBuilder';
import { loadProgress, saveProgress, savePinned } from '../config/storage';
import { tokenColor, colorFromSpec } from '../config/utils';

export interface RosaryMeta {
  setKey: string;
  setName: string;
}

export function useRosary(cfg: RosaryConfig) {
  const [stepIndex, setStepIndex] = useState<number>(() => {
    const p = loadProgress(cfg);
    return Math.max(0, p.idx);
  });

  const [tooltipPinned, setTooltipPinned] = useState<boolean>(() => {
    const p = loadProgress(cfg);
    return p.pinned;
  });

  const [tooltipSource, setTooltipSource] = useState<'primary' | 'secondary'>('primary');

  const built = useMemo<BuildResult>(() => buildSteps(cfg, new Date()), [cfg]);
  const { steps, setKey, setName } = built;
  const meta: RosaryMeta = { setKey, setName };

  const currentStep: Step | null = useMemo(() => {
    if (!steps.length) return null;
    const idx = Math.max(0, Math.min(stepIndex, steps.length - 1));
    return steps[idx];
  }, [steps, stepIndex]);

  const buttonColor = useMemo(() => {
    if (!currentStep) return tokenColor(cfg, 'creed');
    return colorFromSpec(cfg, currentStep.color);
  }, [cfg, currentStep]);

  const progress = useMemo(() => {
    const total = steps.length;
    if (!total) return { currentHuman: 0, total: 0, pct: 0 };
    const currentHuman = Math.min(stepIndex + 1, total);
    const pct = Math.round((currentHuman / total) * 100);
    return { currentHuman, total, pct };
  }, [steps.length, stepIndex]);

  const makeMysteryInfoText = useCallback((s: Step): string => {
    if (!s || !s.mysterySetName || s.decadeIndex == null) return '';
    const base = `${s.mysterySetName}${s.decadeName || `第${s.decadeIndex + 1}端`}`;
    const topic = s.decadeTopic ? `主题：${s.decadeTopic}\n` : '';
    return `${base}\n${topic}`.trim();
  }, []);

  const advance = useCallback(() => {
    if (!steps.length) return;
    const s = currentStep;
    const lastIdx = steps.length - 1;

    if (s && s.id === 'complete') {
      if (cfg.settings.endBehavior.confirmRestartAfterComplete) {
        if (window.confirm('今日玫瑰经已完成。是否从头开始？')) {
          setStepIndex(0);
          saveProgress(cfg, 0);
        }
      } else {
        setStepIndex(0);
        saveProgress(cfg, 0);
      }
      return;
    }

    if (stepIndex >= lastIdx) return;
    const next = stepIndex + 1;
    setStepIndex(next);
    saveProgress(cfg, next);
  }, [steps, currentStep, stepIndex, cfg]);

  const reset = useCallback((withConfirm: boolean) => {
    if (withConfirm && !window.confirm('确认重置进度并从十字圣号开始？')) return;
    setStepIndex(0);
    saveProgress(cfg, 0);
  }, [cfg]);

  const togglePin = useCallback(() => {
    setTooltipPinned(prev => {
      const next = !prev;
      savePinned(cfg, next);
      return next;
    });
  }, [cfg]);

  return {
    meta, steps, stepIndex, currentStep,
    buttonColor, progress,
    tooltipPinned, tooltipSource, setTooltipSource,
    makeMysteryInfoText,
    advance, reset, togglePin,
  };
}
