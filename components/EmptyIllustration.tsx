import Svg, { Ellipse, G, Path, Rect } from 'react-native-svg';

import { useTheme } from '@/lib/theme';

// Open box with a letter flying out, from the empty Home state in the design.
export function EmptyIllustration() {
  const t = useTheme();
  const line = { strokeWidth: 3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={176} height={152} viewBox="0 0 168 148" fill="none">
      <Ellipse cx={84} cy={136} rx={60} ry={6} fill={t.sunk} />
      <G transform="rotate(7 98 36)">
        <Rect x={70} y={14} width={56} height={38} rx={4} fill={t.card} stroke={t.acc} {...line} />
        <Path d="M72 17l26 18 26-18" stroke={t.acc} {...line} />
      </G>
      <Path d="M34 72h100v52a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8z" fill={t.card} stroke={t.soft} {...line} />
      <Rect x={26} y={52} width={106} height={16} rx={5} transform="rotate(-12 26 68)" fill={t.card} stroke={t.soft} {...line} />
      <Rect x={74} y={96} width={20} height={16} rx={3} stroke={t.soft} {...line} />
      <Path d="M78 96v-5a6 6 0 0 1 11.5-2.4" stroke={t.soft} {...line} />
      <Path d="M146 26v10M141 31h10M22 30v8M18 34h8M150 70v6M147 73h6" stroke={t.acc} {...line} strokeWidth={2.5} />
    </Svg>
  );
}
