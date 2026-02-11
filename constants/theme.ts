/**
 * 白色主题设计系统 — 60% 留白 + 毛玻璃
 * 极简、呼吸感、现代化
 */

import { Platform } from 'react-native';

// ─── 主色板 ───────────────────────────────────────────────
const accent = '#6C5CE7';
const accentLight = '#A29BFE';
const accentSoft = '#F0EDFF';

export const Colors = {
  light: {
    text: '#1A1A2E',
    textSecondary: '#64748B',
    background: '#FAFBFE',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    tint: accent,
    icon: '#94A3B8',
    muted: '#94A3B8',
    border: 'rgba(0,0,0,0.06)',
    borderLight: 'rgba(0,0,0,0.03)',
    accent,
    accentLight,
    accentSoft,
    tabIconDefault: '#CBD5E1',
    tabIconSelected: accent,
    glass: 'rgba(255,255,255,0.72)',
    glassBorder: 'rgba(255,255,255,0.5)',
    gradientStart: '#F0EDFF',
    gradientEnd: '#FAFBFE',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    info: '#3B82F6',
    decorPurple: 'rgba(108,92,231,0.08)',
    decorBlue: 'rgba(59,130,246,0.06)',
    decorPink: 'rgba(236,72,153,0.06)',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0B0D17',
    surface: '#131525',
    card: '#1A1D30',
    tint: accentLight,
    icon: '#64748B',
    muted: '#64748B',
    border: 'rgba(255,255,255,0.06)',
    borderLight: 'rgba(255,255,255,0.03)',
    accent: accentLight,
    accentLight: accent,
    accentSoft: '#1E1B3A',
    tabIconDefault: '#475569',
    tabIconSelected: accentLight,
    glass: 'rgba(19,21,37,0.8)',
    glassBorder: 'rgba(255,255,255,0.08)',
    gradientStart: '#131525',
    gradientEnd: '#0B0D17',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    info: '#60A5FA',
    decorPurple: 'rgba(162,155,254,0.08)',
    decorBlue: 'rgba(96,165,250,0.06)',
    decorPink: 'rgba(244,114,182,0.06)',
  },
};

export const Fonts = {
  display: 'SpaceGrotesk_700Bold',
  title: 'SpaceGrotesk_600SemiBold',
  body: 'Sora_400Regular',
  bodyMedium: 'Sora_500Medium',
  bodyBold: 'Sora_600SemiBold',
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),
};

export const Motion = {
  spring: {
    gentle: { damping: 20, stiffness: 120, mass: 0.8 },
    bouncy: { damping: 12, stiffness: 200, mass: 0.6 },
    snappy: { damping: 18, stiffness: 300, mass: 0.5 },
    slow: { damping: 26, stiffness: 80, mass: 1 },
  },
  duration: {
    instant: 100,
    fast: 200,
    normal: 350,
    slow: 500,
    entrance: 600,
    stagger: 60,
  },
  scale: {
    pressed: 0.96,
    hover: 1.03,
    subtle: 0.98,
  },
};
