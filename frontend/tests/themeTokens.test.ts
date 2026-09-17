import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getAccentHsl,
  densityClass,
  fontClass,
  getDensitySpacing,
  ACCENT_PRESETS,
  FONT_PRESETS,
  DENSITY_PRESETS,
  DEFAULT_ACCENT,
  DEFAULT_FONT,
  DEFAULT_DENSITY,
} from '../src/lib/themeTokens';

describe('themeTokens', () => {
  it('returns default hsl for unknown accent', () => {
    const hsl = getAccentHsl('not-a-color');
    assert.deepEqual(hsl, getAccentHsl(DEFAULT_ACCENT));
  });

  it('returns known accent hsl', () => {
    const blue = getAccentHsl('blue');
    assert.ok(blue.h === 220);
  });

  it('computes density classes', () => {
    assert.equal(densityClass('compact'), 'density-compact');
    assert.equal(densityClass('spacious'), 'density-spacious');
  });

  it('computes font classes', () => {
    assert.equal(fontClass('serif'), 'font-serif');
    assert.equal(fontClass('mono'), 'font-mono');
  });

  it('scales spacing per density', () => {
    assert.equal(getDensitySpacing('compact'), 0.5);
    assert.equal(getDensitySpacing('comfortable'), 1);
    assert.equal(getDensitySpacing('spacious'), 1.5);
  });

  it('exposes presets', () => {
    assert.ok(ACCENT_PRESETS.length > 0);
    assert.ok(FONT_PRESETS.length > 0);
    assert.ok(DENSITY_PRESETS.length > 0);
    assert.equal(DEFAULT_FONT, 'sans');
    assert.equal(DEFAULT_DENSITY, 'comfortable');
  });
});
