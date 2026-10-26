import { useColorScheme } from 'react-native';

const light = {
  dark: false,
  bg: '#F4EDE1',
  card: '#FBF7F0',
  sunk: '#EAE0CF',
  line: '#DCCDB8',
  // Stronger line for dashed boxes and the icon buttons on top of photos.
  lineStrong: '#C9B8A2',
  ink: '#2B211C',
  soft: '#6B5A4E',
  acc: '#B4532F',
  accText: '#9C4424',
  accSoft: '#F2D9C6',
  onAcc: '#FFF8F0',
  badge: '#2B211C',
  onBadge: '#F4EDE1',
  badgeSoft: '#CDBFAE',
  lock: '#E8906A',
  err: '#A3261C',
  scrim: 'rgba(43,33,28,0.30)',
  shadow: '0px 1px 2px rgba(60,40,25,0.06), 0px 8px 20px rgba(60,40,25,0.08)',
  shadowStrong: '0px 1px 2px rgba(60,40,25,0.10), 0px 6px 16px rgba(60,40,25,0.14)',
  buttonShadow: '0px 6px 16px rgba(180,83,47,0.28)',
  fabShadow: '0px 10px 24px rgba(180,83,47,0.35)',
  splashBg: '#B4532F',
  splashFg: '#FBF3E8',
  splashIcon: '#FBF3E8',
};

export type Theme = typeof light;

const dark: Theme = {
  dark: true,
  bg: '#1A1512',
  card: '#25201C',
  sunk: '#312924',
  line: '#40352F',
  lineStrong: '#4A3F38',
  ink: '#F2E8DA',
  soft: '#BFAE9C',
  acc: '#D9774F',
  accText: '#E8906A',
  accSoft: '#3D2A20',
  onAcc: '#1A1512',
  badge: '#F2E8DA',
  onBadge: '#2B211C',
  badgeSoft: '#5E4E43',
  lock: '#B4532F',
  err: '#F08A7C',
  scrim: 'rgba(10,8,6,0.45)',
  shadow: '0px 1px 2px rgba(0,0,0,0.30), 0px 10px 24px rgba(0,0,0,0.30)',
  shadowStrong: '0px 1px 2px rgba(0,0,0,0.30), 0px 8px 20px rgba(0,0,0,0.35)',
  buttonShadow: '0px 6px 18px rgba(0,0,0,0.40)',
  fabShadow: '0px 10px 24px rgba(0,0,0,0.45)',
  splashBg: '#1A1512',
  splashFg: '#F2E8DA',
  splashIcon: '#D9774F',
};

export const themes = { light, dark };

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

// Font keys registered with useFonts in app/_layout.tsx.
export const fonts = {
  serif: 'Fraunces_600SemiBold',
  serifItalic: 'Fraunces_400Regular_Italic',
  body: 'DMSans_400Regular',
  medium: 'DMSans_500Medium',
  semibold: 'DMSans_600SemiBold',
};
