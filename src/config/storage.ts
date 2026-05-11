import type { RosaryConfig } from './types';

export function storageKeys(cfg: RosaryConfig) {
  const base = cfg.settings.storageKey || 'rosary_v2';
  return {
    cfg: base + '::config',
    idx: base + '::index',
    pinned: base + '::pinned',
  };
}

export function loadConfig(): RosaryConfig | null {
  const keys = storageKeys({ settings: { storageKey: 'rosary_v2' } } as RosaryConfig);
  const raw = localStorage.getItem(keys.cfg);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export function saveConfig(cfg: RosaryConfig): void {
  const keys = storageKeys(cfg);
  localStorage.setItem(keys.cfg, JSON.stringify(cfg, null, 2));
}

export function loadProgress(cfg: RosaryConfig): { idx: number; pinned: boolean } {
  const keys = storageKeys(cfg);
  const idx = parseInt(localStorage.getItem(keys.idx) || '0', 10);
  const pinned = localStorage.getItem(keys.pinned) === '1';
  return { idx: Number.isFinite(idx) ? idx : 0, pinned };
}

export function saveProgress(cfg: RosaryConfig, stepIndex: number): void {
  const keys = storageKeys(cfg);
  localStorage.setItem(keys.idx, String(stepIndex));
}

export function savePinned(cfg: RosaryConfig, pinned: boolean): void {
  const keys = storageKeys(cfg);
  localStorage.setItem(keys.pinned, pinned ? '1' : '0');
}
