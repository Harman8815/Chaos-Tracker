import type { Settings, ThemeDensity, FontFamily } from '../types';

export interface AccentPreset {
  name: string;
  value: string;
}

export interface FontPreset {
  name: string;
  value: FontFamily;
}

export interface DensityPreset {
  name: string;
  value: ThemeDensity;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { name: 'Indigo', value: 'indigo' },
  { name: 'Blue', value: 'blue' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Amber', value: 'amber' },
  { name: 'Rose', value: 'rose' },
  { name: 'Purple', value: 'purple' },
];

export const FONT_PRESETS: FontPreset[] = [
  { name: 'Inter (Sans)', value: 'sans' },
  { name: 'Serif', value: 'serif' },
  { name: 'Mono', value: 'mono' },
];

export const DENSITY_PRESETS: DensityPreset[] = [
  { name: 'Compact', value: 'compact' },
  { name: 'Comfortable', value: 'comfortable' },
  { name: 'Spacious', value: 'spacious' },
];

interface Hsl {
  h: number;
  s: number;
  l: number;
}

export const ACCENT_HSL: Record<string, Hsl> = {
  indigo: { h: 250, s: 90, l: 55 },
  blue: { h: 220, s: 95, l: 55 },
  emerald: { h: 160, s: 80, l: 35 },
  amber: { h: 40, s: 95, l: 45 },
  rose: { h: 340, s: 90, l: 55 },
  purple: { h: 270, s: 90, l: 55 },
};

export const DEFAULT_ACCENT = 'indigo';
export const DEFAULT_FONT: FontFamily = 'sans';
export const DEFAULT_DENSITY: ThemeDensity = 'comfortable';

export function getAccentHsl(accent: string): Hsl {
  return ACCENT_HSL[accent] ?? ACCENT_HSL[DEFAULT_ACCENT];
}

export function densityClass(density: ThemeDensity): string {
  return `density-${density}`;
}

export function fontClass(family: FontFamily): string {
  return `font-${family}`;
}

export function getDensitySpacing(density: ThemeDensity): number {
  switch (density) {
    case 'compact':
      return 0.5;
    case 'spacious':
      return 1.5;
    default:
      return 1;
  }
}

export function applyThemeCustomizations(settings: Settings): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const hsl = getAccentHsl(settings.accentColor ?? DEFAULT_ACCENT);
  root.style.setProperty('--color-accent-primary', `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`);
  root.style.setProperty(
    '--color-accent-primary-hover',
    `hsl(${hsl.h} ${Math.max(0, hsl.s - 5)}% ${Math.min(100, hsl.l + 6)}%)`,
  );
  root.style.setProperty(
    '--color-accent-primary-active',
    `hsl(${hsl.h} ${Math.max(0, hsl.s - 10)}% ${Math.max(0, hsl.l - 6)}%)`,
  );
  root.classList.remove('density-compact', 'density-comfortable', 'density-spacious');
  root.classList.add(densityClass(settings.density ?? DEFAULT_DENSITY));
  root.classList.remove('font-sans', 'font-serif', 'font-mono');
  root.classList.add(fontClass(settings.fontFamily ?? DEFAULT_FONT));
}
