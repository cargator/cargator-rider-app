import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath} from 'react-native-svg';

function SvgComponent(props) {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <G clipPath="url(#clip0_587_2452)">
        <Path
          d="M21.799 12.111c0 5.35-4.337 9.688-9.688 9.688-5.35 0-9.687-4.337-9.687-9.688 0-5.35 4.337-9.687 9.687-9.687S21.8 6.76 21.8 12.11zm-10.808 5.13l7.187-7.188a.625.625 0 000-.884l-.884-.884a.625.625 0 00-.884 0l-5.861 5.862-2.737-2.737a.625.625 0 00-.884 0l-.884.884a.625.625 0 000 .884l4.063 4.063c.244.244.64.244.884 0z"
          fill="#50CD89"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_587_2452">
          <Path
            fill="#fff"
            transform="translate(2.111 2.111)"
            d="M0 0H20V20H0z"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

export default SvgComponent;
