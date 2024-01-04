import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M3 3l5 5m5 5L8 8m0 0l5-5L3 13"
        stroke="#B3B3B3"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default SvgComponent;
