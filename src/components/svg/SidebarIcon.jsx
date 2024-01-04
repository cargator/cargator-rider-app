import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={36}
      height={36}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M6 10.5A1.5 1.5 0 017.5 9h21a1.5 1.5 0 010 3h-21A1.5 1.5 0 016 10.5zM6 18a1.5 1.5 0 011.5-1.5h11a1.5 1.5 0 010 3h-11A1.5 1.5 0 016 18zm0 7.5A1.5 1.5 0 017.5 24h21a1.5 1.5 0 010 3h-21A1.5 1.5 0 016 25.5z"
        fill="#212121"
      />
    </Svg>
  );
}

export default SvgComponent;
