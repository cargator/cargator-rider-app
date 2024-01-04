import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={1}
      height={60}
      viewBox="0 0 1 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path stroke="#E5E7EB" strokeLinecap="round" d="M0.5 59.5L0.5 0.5" />
    </Svg>
  );
}

export default SvgComponent;
