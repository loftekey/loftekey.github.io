import type { RosaryConfig, ColorSpec, ThemeColors } from './types';

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function safeParseJSON(str: string): { ok: true; value: any } | { ok: false; error: string } {
  try {
    return { ok: true, value: JSON.parse(str) };
  } catch (e: any) {
    return { ok: false, error: e.message };
  }
}

export function tokenColor(cfg: RosaryConfig, token: string): string {
  const m: Record<string, string> = cfg.theme?.colors as any || {};
  return m[token] || '#4C6FFF';
}

export function colorFromSpec(cfg: RosaryConfig, colorSpec: ColorSpec | null): string {
  if (!colorSpec) return tokenColor(cfg, 'creed');
  if (typeof colorSpec === 'string') return colorSpec;
  if (colorSpec.type === 'hex') return colorSpec.value;
  if (colorSpec.type === 'token') return tokenColor(cfg, colorSpec.value);
  return tokenColor(cfg, 'creed');
}

export function validateConfig(cfg: any): string[] {
  const errors: string[] = [];
  if (!cfg || typeof cfg !== 'object') errors.push('配置不是对象。');
  if (!cfg.settings) errors.push('缺少 settings。');
  if (!cfg.theme?.colors) errors.push('缺少 theme.colors。');
  if (!cfg.prayers) errors.push('缺少 prayers（经文库）。');
  if (!cfg.mysteries) errors.push('缺少 mysteries（奥迹定义）。');
  if (cfg.settings?.weekdayMysteryMap) {
    for (let i = 0; i <= 6; i++) {
      if (!cfg.settings.weekdayMysteryMap[String(i)]) {
        errors.push(`weekdayMysteryMap 缺少键 "${i}"。`);
      }
    }
  } else {
    errors.push('缺少 settings.weekdayMysteryMap。');
  }
  const dp = cfg.settings?.decadeClosingPrayer;
  if (dp && !['fatima', 'immaculate', 'none'].includes(dp)) {
    errors.push(`decadeClosingPrayer 仅支持 fatima|immaculate|none，当前为 "${dp}"。`);
  }
  return errors;
}
