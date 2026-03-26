/**
 * Design Tokens for Brain Capture
 *
 * Centralized design system tokens for consistent styling across the application.
 * Use these tokens instead of hardcoding values for better maintainability.
 */

// ============================================================================
// SPACING
// ============================================================================

export const spacing = {
  // Base spacing scale (4px = 0.25rem)
  0: '0px',
  1: '0.25rem',    // 4px
  2: '0.5rem',     // 8px
  3: '0.75rem',    // 12px
  4: '1rem',       // 16px
  5: '1.25rem',    // 20px
  6: '1.5rem',     // 24px
  8: '2rem',       // 32px
  10: '2.5rem',    // 40px
  12: '3rem',      // 48px
  16: '4rem',      // 64px
  20: '5rem',      // 80px
  24: '6rem',      // 96px

  // Semantic spacing
  component: {
    padding: {
      sm: '0.75rem',   // 12px - small components
      md: '1rem',      // 16px - default components
      lg: '1.5rem',    // 24px - large components
    },
    gap: {
      sm: '0.5rem',    // 8px - tight spacing
      md: '1rem',      // 16px - default spacing
      lg: '1.5rem',    // 24px - loose spacing
    },
  },

  page: {
    padding: {
      mobile: '1rem',      // 16px
      tablet: '1.5rem',    // 24px
      desktop: '2rem',     // 32px
    },
    maxWidth: {
      sm: '42rem',     // 672px
      md: '48rem',     // 768px
      lg: '64rem',     // 1024px
      xl: '80rem',     // 1280px
    },
  },

  // Touch targets (mobile)
  touch: {
    minimum: '44px',    // WCAG minimum
    recommended: '48px', // Comfortable tap
    large: '56px',      // Primary actions
  },
} as const;

// ============================================================================
// COLORS
// ============================================================================

export const colors = {
  // Brand colors
  brand: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',  // Primary brand color
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
    secondary: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',  // Secondary brand color
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    accent: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',  // Accent color
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
  },

  // Semantic colors
  semantic: {
    success: {
      light: '#dcfce7',
      DEFAULT: '#16a34a',
      dark: '#15803d',
    },
    error: {
      light: '#fee2e2',
      DEFAULT: '#dc2626',
      dark: '#b91c1c',
    },
    warning: {
      light: '#fef3c7',
      DEFAULT: '#f59e0b',
      dark: '#d97706',
    },
    info: {
      light: '#dbeafe',
      DEFAULT: '#3b82f6',
      dark: '#2563eb',
    },
  },

  // Neutral colors (slate scale)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',  // Body text (light mode)
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Surface colors
  surface: {
    light: {
      background: '#ffffff',
      foreground: '#0f172a',
      card: '#ffffff',
      cardHover: '#f8fafc',
      border: '#e2e8f0',
      input: '#ffffff',
    },
    dark: {
      background: '#0a0a0a',
      foreground: '#ededed',
      card: '#0f172a',
      cardHover: '#1e293b',
      border: '#1e293b',
      input: '#1e293b',
    },
  },

  // Text colors (WCAG AA compliant)
  text: {
    light: {
      primary: '#0f172a',      // slate-900 (contrast: 14.4:1) ✅
      secondary: '#334155',    // slate-700 (contrast: 7.9:1) ✅
      tertiary: '#64748b',     // slate-500 (contrast: 4.6:1) ✅
      disabled: '#cbd5e1',     // slate-300 (contrast: 2.8:1)
      inverse: '#ffffff',
    },
    dark: {
      primary: '#f8fafc',      // slate-50 (contrast: 15.2:1) ✅
      secondary: '#cbd5e1',    // slate-300 (contrast: 8.1:1) ✅
      tertiary: '#94a3b8',     // slate-400 (contrast: 5.2:1) ✅
      disabled: '#475569',     // slate-600 (contrast: 2.5:1)
      inverse: '#0f172a',
    },
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font families
  fontFamily: {
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'Helvetica Neue',
      'Arial',
      'sans-serif',
    ].join(', '),
    mono: [
      'SF Mono',
      'Monaco',
      'Inconsolata',
      'Fira Code',
      'Consolas',
      'monospace',
    ].join(', '),
  },

  // Font sizes (mobile-first)
  fontSize: {
    xs: {
      mobile: '0.75rem',    // 12px
      desktop: '0.75rem',   // 12px
    },
    sm: {
      mobile: '0.875rem',   // 14px
      desktop: '0.875rem',  // 14px
    },
    base: {
      mobile: '1rem',       // 16px (iOS minimum to prevent zoom)
      desktop: '1rem',      // 16px
    },
    lg: {
      mobile: '1.125rem',   // 18px
      desktop: '1.125rem',  // 18px
    },
    xl: {
      mobile: '1.25rem',    // 20px
      desktop: '1.25rem',   // 20px
    },
    '2xl': {
      mobile: '1.5rem',     // 24px
      desktop: '1.5rem',    // 24px
    },
    '3xl': {
      mobile: '1.875rem',   // 30px
      desktop: '1.875rem',  // 30px
    },
    '4xl': {
      mobile: '2.25rem',    // 36px
      desktop: '2.25rem',   // 36px
    },
    '5xl': {
      mobile: '3rem',       // 48px
      desktop: '3rem',      // 48px
    },
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Semantic text styles
  heading: {
    h1: {
      fontSize: { mobile: '1.875rem', desktop: '3rem' },  // 30px → 48px
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: { mobile: '1.5rem', desktop: '2.25rem' },  // 24px → 36px
      fontWeight: '700',
      lineHeight: '1.3',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: { mobile: '1.25rem', desktop: '1.875rem' },  // 20px → 30px
      fontWeight: '600',
      lineHeight: '1.4',
    },
    h4: {
      fontSize: { mobile: '1.125rem', desktop: '1.5rem' },  // 18px → 24px
      fontWeight: '600',
      lineHeight: '1.5',
    },
  },

  body: {
    large: {
      fontSize: '1.125rem',  // 18px
      lineHeight: '1.75',
    },
    default: {
      fontSize: '1rem',      // 16px
      lineHeight: '1.5',
    },
    small: {
      fontSize: '0.875rem',  // 14px
      lineHeight: '1.5',
    },
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '0px',       // Mobile (default)
  sm: '640px',     // Small tablets
  md: '768px',     // Tablets
  lg: '1024px',    // Desktop
  xl: '1280px',    // Large desktop
  '2xl': '1536px', // Extra large desktop
} as const;

// Media query helpers
export const media = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,

  // Max width queries
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
} as const;

// ============================================================================
// BORDER RADIUS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',

  // Semantic radii
  button: '0.5rem',    // 8px
  input: '0.5rem',     // 8px
  card: '0.75rem',     // 12px
  modal: '1rem',       // 16px
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Semantic shadows
  button: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  modal: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  dropdown: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
} as const;

// ============================================================================
// Z-INDEX
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  toast: 1600,
} as const;

// ============================================================================
// ANIMATIONS
// ============================================================================

export const animations = {
  // Durations
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Easing functions
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Keyframes
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    fadeOut: {
      from: { opacity: 1 },
      to: { opacity: 0 },
    },
    slideIn: {
      from: { transform: 'translateY(10px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideOut: {
      from: { transform: 'translateY(0)', opacity: 1 },
      to: { transform: 'translateY(10px)', opacity: 0 },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
  },
} as const;

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example: Using design tokens in components
 *
 * // TypeScript/React
 * import { colors, spacing, typography } from '@/lib/design-tokens';
 *
 * const Button = styled.button`
 *   background-color: ${colors.brand.primary[600]};
 *   padding: ${spacing.component.padding.md};
 *   font-size: ${typography.fontSize.base.mobile};
 *   border-radius: ${borderRadius.button};
 *   box-shadow: ${shadows.button};
 * `;
 *
 * // Tailwind CSS (configure in tailwind.config.ts)
 * <button className="bg-brand-primary-600 p-4 text-base rounded-lg shadow-button">
 *   Click me
 * </button>
 *
 * // CSS-in-JS
 * const styles = {
 *   backgroundColor: colors.brand.primary[600],
 *   padding: spacing.component.padding.md,
 * };
 */

// ============================================================================
// TYPE EXPORTS (for TypeScript)
// ============================================================================

export type SpacingToken = typeof spacing;
export type ColorToken = typeof colors;
export type TypographyToken = typeof typography;
export type BreakpointToken = typeof breakpoints;
export type BorderRadiusToken = typeof borderRadius;
export type ShadowToken = typeof shadows;
export type ZIndexToken = typeof zIndex;
export type AnimationToken = typeof animations;
