import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const colors = {
  // Primary dark theme
  background: '#0A0A0B',
  surface: '#1A1A1D',
  surfaceVariant: '#242428',
  surfaceContainer: '#2A2A2E',
  
  // Accent colors - futuristic neon
  primary: '#00F5FF', // Cyan
  primaryVariant: '#0080FF',
  secondary: '#7B68EE', // Medium slate blue
  secondaryVariant: '#9370DB',
  
  // Status colors
  success: '#00FF7F', // Spring green
  warning: '#FFD700', // Gold
  error: '#FF1744', // Red
  info: '#00BFFF', // Deep sky blue
  
  // Text colors
  onBackground: '#FFFFFF',
  onSurface: '#E8E8E8',
  onSurfaceVariant: '#CCCCCC',
  onPrimary: '#000000',
  onSecondary: '#FFFFFF',
  
  // Grays
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray500: '#737373',
  gray600: '#525252',
  gray700: '#404040',
  gray800: '#262626',
  gray900: '#171717',
  
  // Special effects
  glow: '#00F5FF',
  gradient: {
    primary: ['#00F5FF', '#0080FF'],
    secondary: ['#7B68EE', '#9370DB'],
    dark: ['#0A0A0B', '#1A1A1D'],
    surface: ['#1A1A1D', '#242428'],
  },
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  surfaceOverlay: 'rgba(26, 26, 29, 0.95)',
  glowOverlay: 'rgba(0, 245, 255, 0.1)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'Courier New',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 48,
  },
  
  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
    display: 56,
  },
  
  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const borderRadius = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  none: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  lg: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
  },
  // Glowing shadows for futuristic effect
  glow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 0,
    shadowColor: colors.glow,
  },
  primaryGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 0,
    shadowColor: colors.primary,
  },
};

export const dimensions = {
  window: {
    width,
    height,
  },
  
  // Common dimensions
  headerHeight: 60,
  tabBarHeight: 80,
  buttonHeight: 48,
  inputHeight: 56,
  
  // Icon sizes
  iconSize: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  },
  
  // Avatar sizes
  avatarSize: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
};

export const animations = {
  duration: {
    quick: 150,
    normal: 250,
    slow: 350,
  },
  
  easing: {
    linear: 'linear' as const,
    ease: 'ease' as const,
    easeIn: 'ease-in' as const,
    easeOut: 'ease-out' as const,
    easeInOut: 'ease-in-out' as const,
  },
};

// Component specific styles
export const componentStyles = {
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    ...shadows.md,
    shadowColor: colors.onBackground,
  },
  
  glowCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    ...shadows.primaryGlow,
  },
  
  button: {
    height: dimensions.buttonHeight,
    borderRadius: borderRadius.md,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  input: {
    height: dimensions.inputHeight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.onSurface,
    backgroundColor: colors.surfaceVariant,
    borderWidth: 1,
    borderColor: colors.gray600,
  },
  
  inputFocused: {
    borderColor: colors.primary,
    ...shadows.primaryGlow,
  },
};

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  dimensions,
  animations,
  componentStyles,
};

export type Theme = typeof theme;
export default theme;