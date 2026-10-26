import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconName =
  | 'lock'
  | 'lockOpen'
  | 'lockKeyhole'
  | 'pen'
  | 'plus'
  | 'close'
  | 'back'
  | 'calendar'
  | 'alert'
  | 'clock'
  | 'image'
  | 'refresh'
  | 'box'
  | 'chart'
  | 'sun'
  | 'moon';

type Props = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
};

// Stroke icons on a 24×24 grid, traced from the design.
export function Icon({ name, size = 20, color, strokeWidth = 2.2 }: Props) {
  const stroke = { stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderShapes(name, stroke)}
    </Svg>
  );
}

function renderShapes(name: IconName, s: object) {
  switch (name) {
    case 'lock':
      return (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2} {...s} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...s} />
        </>
      );
    case 'lockOpen':
      return (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2} {...s} />
          <Path d="M8 11V7a4 4 0 0 1 7.6-1.7" {...s} />
        </>
      );
    case 'lockKeyhole':
      return (
        <>
          <Rect x={5} y={11} width={14} height={10} rx={2} {...s} />
          <Path d="M8 11V7a4 4 0 0 1 8 0v4" {...s} />
          <Path d="M12 15v2" {...s} />
        </>
      );
    case 'pen':
      return <Path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" {...s} />;
    case 'plus':
      return <Path d="M12 5v14M5 12h14" {...s} />;
    case 'close':
      return <Path d="M6 6l12 12M18 6L6 18" {...s} />;
    case 'back':
      return <Path d="M15 5l-7 7 7 7" {...s} />;
    case 'calendar':
      return (
        <>
          <Rect x={3.5} y={5} width={17} height={15.5} rx={2.5} {...s} />
          <Path d="M3.5 10h17M8 3v4M16 3v4" {...s} />
        </>
      );
    case 'alert':
      return (
        <>
          <Circle cx={12} cy={12} r={9} {...s} />
          <Path d="M12 7.5v5.5M12 16.5v.01" {...s} />
        </>
      );
    case 'clock':
      return (
        <>
          <Circle cx={12} cy={12} r={9} {...s} />
          <Path d="M12 7v5l3 2" {...s} />
        </>
      );
    case 'image':
      return (
        <>
          <Rect x={3.5} y={4.5} width={17} height={15} rx={2.5} {...s} />
          <Circle cx={9} cy={10} r={1.8} {...s} />
          <Path d="M20.5 16l-5-5-8.5 8.5" {...s} />
        </>
      );
    case 'refresh':
      return <Path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4" {...s} />;
    case 'box':
      return (
        <>
          <Rect x={3.5} y={9} width={17} height={11} rx={2} {...s} />
          <Path d="M3.5 13h17M7 9V5.5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1V9" {...s} />
        </>
      );
    case 'chart':
      return <Path d="M4 20h16M7 16v-5M12 16V6M17 16v-8" {...s} />;
    case 'sun':
      return (
        <>
          <Circle cx={12} cy={12} r={4} {...s} />
          <Path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" {...s} />
        </>
      );
    case 'moon':
      return <Path d="M20.5 13.5A8.5 8.5 0 1 1 10.5 3.5a6.5 6.5 0 0 0 10 10z" {...s} />;
  }
}
