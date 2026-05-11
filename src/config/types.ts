
export interface ThemeColors {
  signOfCross: string;
  creed: string;
  ourFather: string;
  hailMary: string;
  gloryBe: string;
  mystery: string;
  fatima: string;
  immaculate: string;
  hailHolyQueen: string;
  complete: string;
}

export interface ColorSpec {
  type: "hex" | "token";
  value: string;
}

export interface MysterySet {
  name: string;
  decades: string[];
  topics: string[];
}

export interface Settings {
  storageKey: string;
  ui: {
    showProgressBar: boolean;
    containerMaxWidth: number;
  };
  weekdayMysteryMap: Record<string, string>;
  includeMysteryAnnouncementStep: boolean;
  decadeClosingPrayer: "fatima" | "immaculate" | "none";
  endBehavior: {
    confirmRestartAfterComplete: boolean;
  };
}

export interface Prayers {
  signOfCross: string;
  creed: string;
  ourFather: string;
  hailMary: string;
  gloryBe: string;
  fatima: string;
  immaculate: string;
  hailHolyQueen: string;
  complete: string;
}

export interface RosaryConfig {
  version: number;
  settings: Settings;
  theme: { colors: ThemeColors };
  mysteries: Record<string, MysterySet>;
  decadeHailMaryColorTokens: string[];
  prayers: Prayers;
}

export type Phase = "nonMystery" | "mysteryMeditation" | "mysteryLoop";

export interface Step {
  id: string;
  label: string;
  text: string;
  color: ColorSpec;
  phase: Phase;
  mysterySetKey: string | null;
  mysterySetName: string | null;
  decadeIndex: number | null;
  decadeName: string | null;
  decadeTopic: string | null;
  shortPrayerName: string | null;
}
