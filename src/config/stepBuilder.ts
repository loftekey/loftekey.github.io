import type { RosaryConfig, Step, ColorSpec } from './types';

function makeStep(opts: {
  id: string;
  label: string;
  text: string;
  color: ColorSpec;
  phase?: Step['phase'];
  mysterySetKey?: string | null;
  mysterySetName?: string | null;
  decadeIndex?: number | null;
  decadeName?: string | null;
  decadeTopic?: string | null;
  shortPrayerName?: string | null;
}): Step {
  return {
    id: opts.id,
    label: opts.label,
    text: opts.text,
    color: opts.color,
    phase: opts.phase || 'nonMystery',
    mysterySetKey: opts.mysterySetKey ?? null,
    mysterySetName: opts.mysterySetName ?? null,
    decadeIndex: opts.decadeIndex ?? null,
    decadeName: opts.decadeName ?? null,
    decadeTopic: opts.decadeTopic ?? null,
    shortPrayerName: opts.shortPrayerName ?? null,
  };
}

function weekdayMysterySet(cfg: RosaryConfig, date: Date): string {
  const map = cfg.settings.weekdayMysteryMap;
  const day = String(date.getDay());
  return map[day] || 'joyful';
}

export interface BuildResult {
  setKey: string;
  setName: string;
  steps: Step[];
}

export function buildSteps(cfg: RosaryConfig, date: Date): BuildResult {
  const steps: Step[] = [];
  const setKey = weekdayMysterySet(cfg, date);
  const set = cfg.mysteries[setKey];
  const setName = set ? set.name : '奥迹';
  const decades = set ? set.decades : ['第一端', '第二端', '第三端', '第四端', '第五端'];
  const topics = set ? set.topics || [] : [];

  // ── 开头（非奥迹）──
  steps.push(makeStep({
    id: 'intro-sign', label: '十字圣号', shortPrayerName: '十字圣号',
    text: cfg.prayers.signOfCross,
    color: { type: 'token', value: 'signOfCross' },
  }));

  steps.push(makeStep({
    id: 'intro-creed', label: '信经', shortPrayerName: '信经',
    text: cfg.prayers.creed,
    color: { type: 'token', value: 'creed' },
  }));

  steps.push(makeStep({
    id: 'intro-ourfather', label: '天主经', shortPrayerName: '天主经',
    text: cfg.prayers.ourFather,
    color: { type: 'token', value: 'ourFather' },
  }));

  for (let i = 1; i <= 3; i++) {
    steps.push(makeStep({
      id: `intro-hailmary-${i}`, label: `圣母经 ${i}/3`, shortPrayerName: '圣母经',
      text: cfg.prayers.hailMary,
      color: { type: 'token', value: 'hailMary' },
    }));
  }

  steps.push(makeStep({
    id: 'intro-glorybe', label: '光荣经', shortPrayerName: '光荣经',
    text: cfg.prayers.gloryBe,
    color: { type: 'token', value: 'gloryBe' },
  }));

  // ── 奥迹五端 ──
  for (let d = 0; d < 5; d++) {
    const decadeName = decades[d] || `第${d + 1}端`;
    const decadeTopic = topics[d] || '';

    if (cfg.settings.includeMysteryAnnouncementStep) {
      const label = `${setName}${decadeName} · 宣告奥迹`;
      const infoText = `${setName}${decadeName}\n${decadeTopic ? `主题：${decadeTopic}\n` : ''}（默想阶段）`;
      steps.push(makeStep({
        id: `mystery-${setKey}-${d + 1}-announce`,
        label,
        text: infoText,
        color: { type: 'token', value: 'mystery' },
        phase: 'mysteryMeditation',
        mysterySetKey: setKey, mysterySetName: setName,
        decadeIndex: d, decadeName, decadeTopic,
      }));
    }

    // 天主经
    steps.push(makeStep({
      id: `mystery-${setKey}-${d + 1}-ourfather`,
      label: `${setName}${decadeName} · 天主经`, shortPrayerName: '天主经',
      text: cfg.prayers.ourFather,
      color: { type: 'token', value: 'ourFather' },
      phase: 'mysteryLoop',
      mysterySetKey: setKey, mysterySetName: setName,
      decadeIndex: d, decadeName, decadeTopic,
    }));

    const hmToken = (cfg.decadeHailMaryColorTokens[d]) || 'hailMary';

    for (let j = 1; j <= 10; j++) {
      steps.push(makeStep({
        id: `mystery-${setKey}-${d + 1}-hailmary-${j}`,
        label: `${setName}${decadeName} · 圣母经 ${j}/10`,
        shortPrayerName: `圣母经 ${j}/10`,
        text: cfg.prayers.hailMary,
        color: { type: 'token', value: hmToken },
        phase: 'mysteryLoop',
        mysterySetKey: setKey, mysterySetName: setName,
        decadeIndex: d, decadeName, decadeTopic,
      }));
    }

    // 光荣经
    steps.push(makeStep({
      id: `mystery-${setKey}-${d + 1}-glorybe`,
      label: `${setName}${decadeName} · 光荣经`, shortPrayerName: '光荣经',
      text: cfg.prayers.gloryBe,
      color: { type: 'token', value: 'gloryBe' },
      phase: 'mysteryLoop',
      mysterySetKey: setKey, mysterySetName: setName,
      decadeIndex: d, decadeName, decadeTopic,
    }));

    // 补充经文
    const choice = cfg.settings.decadeClosingPrayer;
    if (choice === 'fatima') {
      steps.push(makeStep({
        id: `mystery-${setKey}-${d + 1}-closing-fatima`,
        label: `${setName}${decadeName} · 补充经文（法蒂玛）`,
        shortPrayerName: '法蒂玛',
        text: cfg.prayers.fatima,
        color: { type: 'token', value: 'fatima' },
        phase: 'mysteryLoop',
        mysterySetKey: setKey, mysterySetName: setName,
        decadeIndex: d, decadeName, decadeTopic,
      }));
    } else if (choice === 'immaculate') {
      steps.push(makeStep({
        id: `mystery-${setKey}-${d + 1}-closing-immaculate`,
        label: `${setName}${decadeName} · 补充经文（圣母无染原罪）`,
        shortPrayerName: '圣母无染原罪',
        text: cfg.prayers.immaculate,
        color: { type: 'token', value: 'immaculate' },
        phase: 'mysteryLoop',
        mysterySetKey: setKey, mysterySetName: setName,
        decadeIndex: d, decadeName, decadeTopic,
      }));
    }
  }

  // ── 结尾 ──
  steps.push(makeStep({
    id: 'outro-hailholyqueen', label: '又圣母经', shortPrayerName: '又圣母经',
    text: cfg.prayers.hailHolyQueen,
    color: { type: 'token', value: 'hailHolyQueen' },
  }));

  steps.push(makeStep({
    id: 'outro-sign', label: '十字圣号', shortPrayerName: '十字圣号',
    text: cfg.prayers.signOfCross,
    color: { type: 'token', value: 'signOfCross' },
  }));

  steps.push(makeStep({
    id: 'complete', label: '完成', shortPrayerName: '完成',
    text: cfg.prayers.complete,
    color: { type: 'token', value: 'complete' },
  }));

  return { setKey, setName, steps };
}
